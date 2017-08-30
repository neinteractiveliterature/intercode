function buildStateChange(state, modelKey, field, newValue) {
  return {
    [modelKey]: { ...state[modelKey], [field]: newValue },
  };
}

export function getStateChangeForInputChange(event, state, modelKey) {
  return buildStateChange(state, modelKey, event.target.name, event.target.value);
}

export function getStateChangeForCheckboxChange(event, state, modelKey) {
  return buildStateChange(state, modelKey, event.target.name, event.target.checked);
}

export default {
  getStateChangeForInputChange,
  getStateChangeForCheckboxChange,
};
