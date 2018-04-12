import { parseIntOrNull, parseFloatOrNull, convertDatetimeValue } from './FormUtils';

function namedFunction(func, name) {
  Object.defineProperty(func, 'name', { value: name });
  return func;
}

export const Transforms = {
  identity(value) { return value; },
  integer(value) { return parseIntOrNull(value); },
  float(value) { return parseFloatOrNull(value); },
  datetime(timezoneName) {
    return namedFunction(
      value => convertDatetimeValue(value, timezoneName),
      `datetime('${timezoneName}')`,
    );
  },
  booleanString(value) { return value === 'true'; },
  multiValue(choices) { return choices.map(choice => choice.value); },
  eventTargetValue(event) { return event.target.value; },
  eventTargetChecked(event) { return event.target.checked; },
};

Transforms.inputChange = function inputChange(wrappedTransform) {
  return namedFunction(
    event => wrappedTransform(Transforms.eventTargetValue(event)),
    `inputChange('${wrappedTransform.name}')`,
  );
};
Transforms.checkboxChange = function checkboxChange(event) {
  return Transforms.eventTargetChecked(event);
};
Transforms.textInputChange = function textInputChange(event) {
  return Transforms.eventTargetValue(event);
};

export function stateChangeCalculator(
  name,
  transform,
  preprocessState = Transforms.identity,
  postprocessState = Transforms.identity,
) {
  return namedFunction(
    (state, value) => postprocessState({ ...preprocessState(state), [name]: transform(value) }),
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
      if (typeof transformsByName[name] === 'function') {
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
          namedFunction(state => preprocessState(state)[name], `dig('${name}')`),
          namedFunction(state => postprocessState({ [name]: state }), `bury('${name}')`),
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

export function componentLocalStateUpdater(component, stateChangeCalculators) {
  return stateUpdater(
    () => component.state,
    state => component.setState(state),
    stateChangeCalculators,
  );
}
