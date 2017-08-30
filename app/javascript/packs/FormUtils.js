export function getStateChangeForInputChange(event, state, modelKey) {
  return {
    [modelKey]: { ...this.state[modelKey], [event.target.name]: event.target.value },
  };
}

export function getStateChangeForCheckboxChange(event, state, modelKey) {
  return {
    [modelKey]: { ...this.state[modelKey], [event.target.name]: event.target.checked },
  };
}

export default {
  getStateChangeForInputChange,
};
