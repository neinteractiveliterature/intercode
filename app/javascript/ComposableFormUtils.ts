import moment, { Moment } from 'moment-timezone';
import { useState, useMemo } from 'react';
import { assertNever } from 'assert-never';

export function parseIntOrNull(stringValue: string) {
  const intValue = parseInt(stringValue, 10);
  if (Number.isNaN(intValue)) {
    return null;
  }
  return intValue;
}

export function parseFloatOrNull(stringValue: string) {
  const floatValue = parseFloat(stringValue);
  if (Number.isNaN(floatValue)) {
    return null;
  }
  return floatValue;
}

export function parseMoneyOrNull(value: string) {
  const newPrice = parseFloatOrNull(value);

  if (newPrice == null) {
    return null;
  }

  return {
    fractional: Math.floor(newPrice * 100),
    currency_code: 'USD',
  };
}

export function forceTimezoneForDatetimeValue(value: string | null | Moment, timezoneName: string) {
  if (value == null) {
    return value;
  }

  if (typeof value === 'string') {
    const valueWithoutTimezone = value.replace(/(Z|[+-]\d\d(:\d\d)?)$/, '');
    return forceTimezoneForDatetimeValue(moment(valueWithoutTimezone), timezoneName);
  }

  // it's hopefully a moment
  const valueInTimezone = moment.tz(value.toObject(), timezoneName);
  return valueInTimezone.toISOString(true);
}

export function convertDatetimeValue(value: string | null | Moment, timezoneName?: string) {
  if (value == null) {
    return value;
  }

  const momentValue = timezoneName ? moment.tz(value, timezoneName) : moment(value);
  if (momentValue.isValid()) {
    return momentValue.toISOString(!!timezoneName);
  }

  return null;
}

function namedFunction<A extends any[], R>(
  func: (...args: A) => R, name: string,
): (...args: A) => R {
  try {
    Object.defineProperty(func, 'name', { value: name });
  } catch (error) {
    // fall back to just not naming the function if the browser doesn't support it (e.g. Safari 9)
  }
  return func;
}

export const Transforms = {
  identity<T>(value: T) { return value; },
  integer(value: string) { return parseIntOrNull(value); },
  float(value: string) { return parseFloatOrNull(value); },
  datetime(value: string | null | Moment) { return convertDatetimeValue(value); },
  datetimeWithTimezone(timezoneName: string) {
    return namedFunction(
      (value: string | null | Moment) => convertDatetimeValue(value, timezoneName),
      `datetimeWithTimezone('${timezoneName}')`,
    );
  },
  datetimeWithForcedTimezone(timezoneName: string) {
    return namedFunction(
      (value: string | null | Moment) => forceTimezoneForDatetimeValue(value, timezoneName),
      `datetimeWithForcedTimezone('${timezoneName}')`,
    );
  },
  negate<T>(func: (value: T) => boolean) { return namedFunction((value: T) => !func(value), 'negate'); },
  parseInt<T>(func: (value: T) => string) {
    return namedFunction((value: T) => Number.parseInt(func(value), 10), 'parseInt');
  },
  booleanString(value: string) { return value === 'true'; },
  multiValue<T>(choices: { value: T }[]) { return choices.map((choice) => choice.value); },
};

export function stateChangeCalculator(
  name: string,
  transform: (value: any) => any,
  preprocessState: (state: any) => any = Transforms.identity,
  postprocessState: (state: any) => any = Transforms.identity,
) {
  const actualTransform = transform || Transforms.identity;
  return namedFunction(
    (state, value) => postprocessState({
      ...preprocessState(state),
      [name]: actualTransform(value),
    }),
    `stateChangeCalculator('${name}')`,
  );
}

export function combineStateChangeCalculators(
  transformsByName: any,
  preprocessState: (state: any) => any = Transforms.identity,
  postprocessState: (state: any) => any = Transforms.identity,
) {
  return Object.keys(transformsByName).reduce(
    (acc, name) => {
      if (transformsByName[name] == null || typeof transformsByName[name] === 'function') {
        return {
          ...acc,
          [name]: stateChangeCalculator(
            name,
            transformsByName[name],
            preprocessState,
            postprocessState,
          ),
        };
      }

      return {
        ...acc,
        [name]: combineStateChangeCalculators(
          transformsByName[name],
          namedFunction((state) => preprocessState(state)[name], `dig('${name}')`),
          namedFunction((state) => postprocessState({ [name]: state }), `bury('${name}')`),
        ),
      };
    },
    {},
  );
}

export function stateUpdater<T>(
  getState: () => T,
  setState: (state: T) => void,
  stateChangeCalculators: any,
) {
  return Object.keys(stateChangeCalculators).reduce(
    (acc, name) => {
      if (typeof stateChangeCalculators[name] === 'function') {
        return {
          ...acc,
          [name]: namedFunction(
            (value) => {
              setState(stateChangeCalculators[name](getState(), value));
            },
            `stateFieldUpdater('${name}')`,
          ),
        };
      }

      return {
        ...acc,
        [name]: stateUpdater(getState, setState, stateChangeCalculators[name]),
      };
    },
    {},
  );
}

type MutatorConfigWithComponent<T> = {
  component: React.Component<any, T>,
  transforms: any,
};

type MutatorConfigWithGetterAndSetter<T> = {
  getState: () => T,
  setState: (state: T) => void,
  transforms: any,
};

export type MutatorConfig<T> = MutatorConfigWithComponent<T> | MutatorConfigWithGetterAndSetter<T>;

function mutatorConfigHasComponent<T>(
  config: MutatorConfig<T>,
): config is MutatorConfigWithComponent<T> {
  return Object.prototype.hasOwnProperty.call(config, 'component');
}

export function mutator<T>(config: MutatorConfig<T>) {
  return stateUpdater(
    mutatorConfigHasComponent(config) ? () => config.component.state : config.getState,
    mutatorConfigHasComponent(config)
      ? (state) => config.component.setState(state)
      : config.setState,
    combineStateChangeCalculators(config.transforms),
  );
}

export function useTransformedState<T, I>(
  initialValue: T, transform: (untransformedValue: I) => T,
) {
  const [state, setState] = useState<T>(initialValue);
  const setStateWithTransform = (untransformedValue: I) => setState(transform(untransformedValue));

  return [state, setStateWithTransform];
}

export type TransformsReducerChangeAction<StateType, Key extends keyof StateType> = {
  type: 'change',
  key: Key,
  value: StateType[Key],
};

export type TransformsReducerAction = TransformsReducerChangeAction<any, any>;
export type TransformsReducer<StateType> = (
  (state: StateType, action: TransformsReducerAction) => StateType
);

export function transformsReducer<StateType>(
  transforms: { [x in keyof StateType]: (value: any) => StateType[x] },
): TransformsReducer<StateType> {
  return (state: StateType, action: TransformsReducerAction) => {
    switch (action.type) {
      case 'change':
        return {
          ...state,
          [action.key]: (transforms[action.key] || Transforms.identity)(action.value),
        };
      default:
        return assertNever(action.type);
    }
  };
}

export function useChangeDispatchers<StateType>(
  dispatch: (action: TransformsReducerAction) => void, keys: (keyof StateType)[],
) {
  return useMemo(
    () => keys.map((key) => (value: StateType[typeof key]) => dispatch({ type: 'change', key, value })),
    [dispatch, keys],
  );
}
