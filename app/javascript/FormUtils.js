import moment from 'moment-timezone';

export function getStateChangeForValueChange(state, modelKey, field, newValue) {
  return {
    [modelKey]: { ...state[modelKey], [field]: newValue },
  };
}

export function getStateChangeForInputChange(event, state, modelKey) {
  return getStateChangeForValueChange(state, modelKey, event.target.name, event.target.value);
}

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

export function getStateChangeForIntegerInputChange(event, state, modelKey) {
  return getStateChangeForValueChange(
    state,
    modelKey,
    event.target.name,
    parseIntOrNull(event.target.value),
  );
}

export function getStateChangeForCheckboxChange(event, state, modelKey) {
  return getStateChangeForValueChange(state, modelKey, event.target.name, event.target.checked);
}

function convertDatetimeValue(value, timezoneName) {
  if (value == null || typeof value === 'string') {
    return value;
  }

  // it's hopefully a moment
  const valueInTimezone = moment.tz(value.toObject(), timezoneName);
  return valueInTimezone.toISOString();
}

export const FIELD_TYPES = {
  BOOLEAN: 'boolean',
  CHECKBOX: 'checkbox',
  DATETIME: 'datetime',
  INTEGER: 'integer',
  OBJECT: 'object',
  SELECT: 'select',
  SELECT_MULTIPLE: 'select_multiple',
  STRING: 'string',
};

export class StateMutator {
  static forComponent(stateChangeCalculator, component) {
    return new StateMutator(
      stateChangeCalculator,
      () => component.state,
      (...args) => { component.setState(...args); },
    );
  }

  static forStatelessComponent(stateChangeCalculator, component, onChange) {
    const { modelKey } = stateChangeCalculator;

    return new StateMutator(
      stateChangeCalculator,
      () => ({ [modelKey]: component.props[modelKey] }),
      ({ [modelKey]: value }) => { onChange(value); },
    );
  }

  constructor(stateChangeCalculator, getState, setState) {
    this.stateChangeCalculator = stateChangeCalculator;
    this.getState = getState;
    this.setState = setState;
  }

  onInputChange = (event) => {
    const stateChange = this.stateChangeCalculator
      .getStateChangeForEvent(this.getState(), event);

    this.setState(stateChange);
  }

  onValueChange = (field, newValue) => {
    const stateChange = this.stateChangeCalculator
      .getStateChangeForValueChange(this.getState(), field, newValue);

    this.setState(stateChange);
  }

  valueChangeCallback = field => (newValue) => { this.onValueChange(field, newValue); }
}

export class ModelStateChangeCalculator {
  constructor(modelKey, fieldDefinitions, getTimezoneName) {
    this.modelKey = modelKey;
    this.fieldDefinitions = fieldDefinitions;
    this.getTimezoneName = getTimezoneName;
  }

  getStateChangeForEvent = (state, event) => {
    const field = event.target.name;

    switch (this.fieldDefinitions[field]) {
      case FIELD_TYPES.BOOLEAN:
        return getStateChangeForValueChange(state, this.modelKey, field, event.target.value === 'true');
      case FIELD_TYPES.CHECKBOX:
        return getStateChangeForCheckboxChange(event, state, this.modelKey);
      case FIELD_TYPES.INTEGER:
        return getStateChangeForIntegerInputChange(event, state, this.modelKey);
      case FIELD_TYPES.STRING:
        return getStateChangeForInputChange(event, state, this.modelKey);
      default:
        throw new Error(`Invalid field type for getStateChangeForEvent: ${this.fieldDefinitions[field]}`);
    }
  }

  getStateChangeForValueChange = (state, field, newValue) => {
    let convertedValue;

    switch (this.fieldDefinitions[field]) {
      case FIELD_TYPES.DATETIME:
        convertedValue = convertDatetimeValue(newValue, this.getTimezoneName());
        break;
      case FIELD_TYPES.SELECT_MULTIPLE:
        convertedValue = newValue.map(choice => choice.value);
        break;
      case FIELD_TYPES.SELECT:
        convertedValue = newValue.value;
        break;
      default:
        convertedValue = newValue;
        break;
    }

    return getStateChangeForValueChange(state, this.modelKey, field, convertedValue);
  }

  getMutator = (getState, setState) => new StateMutator(this, getState, setState)
  getMutatorForComponent = component => StateMutator.forComponent(this, component)
  getMutatorForStatelessComponent = (component, onChange) => (
    StateMutator.forStatelessComponent(this, component, onChange)
  )
}
