import { useState, useMemo } from 'react';
import { DateTime } from 'luxon';

export function parseIntOrNull(stringValue) {
  const intValue = parseInt(stringValue, 10);
  if (Number.isNaN(intValue)) {
    return null;
  }
  return intValue;
}

export function parseFloatOrNull(stringValue) {
  const floatValue = parseFloat(stringValue, 10);
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

export function convertDatetimeValue(value, timezoneName = null) {
  if (value == null) {
    return value;
  }

  const dateTime = DateTime.fromISO(value, { zone: timezoneName ?? 'Etc/UTC' });
  if (dateTime.isValid) {
    return dateTime.toISO();
  }

  return null;
}

function namedFunction(func, name) {
  try {
    Object.defineProperty(func, 'name', { value: name });
  } catch (error) {
    // fall back to just not naming the function if the browser doesn't support it (e.g. Safari 9)
  }
  return func;
}

export const Transforms = {
  identity(value) { return value; },
  integer(value) { return parseIntOrNull(value); },
  float(value) { return parseFloatOrNull(value); },
  datetime(value) { return convertDatetimeValue(value); },
  datetimeWithTimezone(timezoneName) {
    return namedFunction(
      (value) => convertDatetimeValue(value, timezoneName),
      `datetimeWithTimezone('${timezoneName}')`,
    );
  },
  negate(func) { return namedFunction((value) => !func(value), 'negate'); },
  parseInt(func) { return namedFunction((value) => Number.parseInt(func(value), 10), 'parseInt'); },
  booleanString(value) { return value === 'true'; },
  multiValue(choices) { return choices.map((choice) => choice.value); },
};

export function stateChangeCalculator(
  name,
  transform,
  preprocessState = Transforms.identity,
  postprocessState = Transforms.identity,
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
  transformsByName,
  preprocessState = Transforms.identity,
  postprocessState = Transforms.identity,
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

export function stateUpdater(getState, setState, stateChangeCalculators) {
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

export function mutator(config = {}) {
  if (!config.component && !(config.getState && config.setState)) {
    throw new Error('mutator requires either a component or getState/setState');
  }

  return stateUpdater(
    config.component ? () => config.component.state : config.getState,
    config.component ? (state) => config.component.setState(state) : config.setState,
    combineStateChangeCalculators(config.transforms),
  );
}

export function useTransformedState(initialValue, transform) {
  const [state, setState] = useState(initialValue);
  const setStateWithTransform = (untransformedValue) => setState(transform(untransformedValue));

  return [state, setStateWithTransform];
}

export function transformsReducer(transforms) {
  return (state, action) => {
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

export function useChangeDispatchers(dispatch, keys) {
  return useMemo(
    () => keys.map((key) => (value) => dispatch({ type: 'change', key, value })),
    [dispatch, keys],
  );
}
