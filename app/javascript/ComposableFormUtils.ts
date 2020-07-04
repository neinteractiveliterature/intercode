import { useState, useMemo } from 'react';
import { DateTime } from 'luxon';

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

export function parseMoneyOrNull(value) {
  const newPrice = parseFloatOrNull(value);

  if (newPrice == null) {
    return null;
  }

  return {
    fractional: Math.floor(newPrice * 100),
    currency_code: 'USD',
  };
}

export function convertDatetimeValue(value?: DateTime | string | null, timezoneName?: string) {
  if (value == null) {
    return value;
  }

  const dateTime = (
    DateTime.isDateTime(value) ? value : DateTime.fromISO(value)
  ).setZone(timezoneName ?? 'Etc/UTC');

  if (dateTime.isValid) {
    return dateTime.toISO();
  }

  return null;
}

function namedFunction<A extends any[], R>(func: (...args: A) => R, name: string) {
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
  datetime(value: string) { return convertDatetimeValue(value); },
  datetimeWithTimezone(timezoneName: string) {
    return namedFunction(
      (value: string) => convertDatetimeValue(value, timezoneName),
      `datetimeWithTimezone('${timezoneName}')`,
    );
  },
  negate<A extends any[]>(func: (...args: A) => boolean) {
    return namedFunction((...args: A) => !func(...args), 'negate');
  },
  booleanString(value: string) { return value === 'true'; },
  multiValue<T>(choices: { value: T }[]) { return choices.map((choice) => choice.value); },
};

export function stateChangeCalculator<T, R>(
  name: string,
  transform: (value: T) => R,
  preprocessState: (state: any) => any = Transforms.identity,
  postprocessState: (state: any) => any = Transforms.identity,
) {
  const actualTransform = transform || Transforms.identity;
  return namedFunction(
    (state, value: T) => postprocessState({
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
          namedFunction((state: any) => preprocessState(state)[name], `dig('${name}')`),
          namedFunction((state: any) => postprocessState({ [name]: state }), `bury('${name}')`),
        ),
      };
    },
    {},
  );
}

export function stateUpdater(
  getState: () => any,
  setState: (state: any) => void,
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

// Deprecated
export function mutator(config: any = {}) {
  if (!config.component && !(config.getState && config.setState)) {
    throw new Error('mutator requires either a component or getState/setState');
  }

  return stateUpdater(
    config.component ? () => config.component.state : config.getState,
    config.component ? (state) => config.component.setState(state) : config.setState,
    combineStateChangeCalculators(config.transforms),
  );
}

export function useTransformedState<T, U>(initialValue: T, transform: (untransformed: U) => T) {
  const [state, setState] = useState(initialValue);
  const setStateWithTransform = (untransformedValue: U) => setState(transform(untransformedValue));

  return [state, setStateWithTransform];
}

export interface TransformsReducerChangeAction {
  type: 'change',
  key: string,
  value: any,
}

type TransformsReducerAction = TransformsReducerChangeAction;

export function transformsReducer<StateType>(transforms: { [key: string]: (value: any) => any }) {
  return (state: StateType, action: TransformsReducerAction) => {
    switch (action.type) {
      case 'change':
        return {
          ...state,
          [action.key]: (transforms[action.key] || Transforms.identity)(action.value),
        };
      default:
        return state;
    }
  };
}

export function useChangeDispatchers<StateType>(
  dispatch: (action: TransformsReducerAction) => StateType,
  keys: string[],
) {
  return useMemo(
    () => keys.map((key) => (value: any) => dispatch({ type: 'change', key, value })),
    [dispatch, keys],
  );
}
