import { parseIntOrNull, parseFloatOrNull, convertDatetimeValue } from './FormUtils';

export const Transforms = {
  identity: value => value,
  integer: parseIntOrNull,
  float: parseFloatOrNull,
  datetime: timezoneName => (value => convertDatetimeValue(value, timezoneName)),
  booleanString: value => value === 'true',
  multiValue: choices => choices.map(choice => choice.value),
  eventTargetValue: event => event.target.value,
  eventTargetChecked: event => event.target.checked,
};

Transforms.inputChange = transform => transform(Transforms.eventTargetValue);
Transforms.checkboxChange = Transforms.eventTargetChecked;
Transforms.textInputChange = Transforms.eventTargetValue;

export function stateMerger(getState) {
  return newState => ({ ...getState(), ...newState });
}

export function subkeyStateMerger(getState, subkey) {
  return (newState) => {
    const state = getState();
    const subMerger = stateMerger(() => state[subkey]);
    return { ...state, [subkey]: subMerger(newState[subkey]) };
  };
}

export function stateChangeCalculator(name, transform) {
  return (state, value) => ({ ...state, [name]: transform(value) });
}

export function composeStateChangeCalculators(transformsByName) {
  return Object.keys(transformsByName).reduce(
    (acc, name) => ({ ...acc, [name]: stateChangeCalculator(name, transformsByName[name]) }),
    {},
  );
}

export function stateUpdater(getState, setState, stateChangeCalculators) {
  return Object.keys(stateChangeCalculators).reduce(
    (acc, name) => ({
      ...acc,
      [name]: (value) => { setState(stateChangeCalculators[name](getState(), value)); },
    }),
    {},
  );
}

export function componentStateFieldUpdater(component, stateField, stateChangeCalculators) {
  return stateUpdater(
    () => component.state[stateField],
    (newState) => { component.setState({ [stateField]: newState }); },
    stateChangeCalculators,
  );
}
