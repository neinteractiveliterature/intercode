import moment from 'moment';
import * as FormUtils from '../../app/javascript/FormUtils';

const initialGizmo = {
  shouldntChange: 1,
  intField: 2,
  stringField: 'blue',
  booleanField: false,
  checkboxField: false,
  datetimeField: null,
  selectField: 'a',
  selectMultipleField: ['a', 'b'],
  objectField: { a: 1 },
};

const state = { gizmo: initialGizmo };

const stateChangeCalculator = new FormUtils.ModelStateChangeCalculator(
  'gizmo',
  {
    shouldntChange: FormUtils.FIELD_TYPES.INTEGER,
    intField: FormUtils.FIELD_TYPES.INTEGER,
    stringField: FormUtils.FIELD_TYPES.STRING,
    booleanField: FormUtils.FIELD_TYPES.BOOLEAN,
    checkboxField: FormUtils.FIELD_TYPES.CHECKBOX,
    datetimeField: FormUtils.FIELD_TYPES.DATETIME,
    selectField: FormUtils.FIELD_TYPES.SELECT,
    selectMultipleField: FormUtils.FIELD_TYPES.SELECT_MULTIPLE,
    objectField: FormUtils.FIELD_TYPES.OBJECT,
  },
  () => 'US/Eastern',
);

describe('getStateChangeForValueChange', () => {
  test('it modifies just the changed field', () => {
    expect(FormUtils.getStateChangeForValueChange(state, 'gizmo', 'intField', 6)).toEqual({
      gizmo: { ...initialGizmo, intField: 6 },
    });
  });
});

describe('getStateChangeForInputChange', () => {
  test('it modifies the proper field', () => {
    const event = { target: { name: 'stringField', value: 'green' } };
    expect(FormUtils.getStateChangeForInputChange(event, state, 'gizmo')).toEqual({
      gizmo: { ...initialGizmo, stringField: 'green' },
    });
  });
});

describe('getStateChangeForIntegerInputChange', () => {
  test('it modifies the proper field with a parsed int', () => {
    const event = { target: { name: 'intField', value: '6' } };
    expect(FormUtils.getStateChangeForIntegerInputChange(event, state, 'gizmo')).toEqual({
      gizmo: { ...initialGizmo, intField: 6 },
    });
  });

  test('it sets null for non-parseable ints', () => {
    const event = { target: { name: 'intField', value: '' } };
    expect(FormUtils.getStateChangeForIntegerInputChange(event, state, 'gizmo')).toEqual({
      gizmo: { ...initialGizmo, intField: null },
    });
  });
});

describe('getStateChangeForCheckboxChange', () => {
  test('it modifies the proper field using the checked boolean', () => {
    const event = { target: { name: 'checkboxField', checked: true } };
    expect(FormUtils.getStateChangeForCheckboxChange(event, state, 'gizmo')).toEqual({
      gizmo: { ...initialGizmo, checkboxField: true },
    });
  });
});

describe('ModelStateChangeCalculator', () => {
  describe('getStateChangeForEvent', () => {
    test('it changes state properly for a boolean field', () => {
      expect(stateChangeCalculator.getStateChangeForEvent(
        state,
        { target: { name: 'booleanField', value: 'true' } },
      ).gizmo.booleanField).toEqual(true);

      expect(stateChangeCalculator.getStateChangeForEvent(
        state,
        { target: { name: 'booleanField', value: 'false' } },
      ).gizmo.booleanField).toEqual(false);
    });

    test('it changes state properly for a checkbox field', () => {
      expect(stateChangeCalculator.getStateChangeForEvent(
        state,
        { target: { name: 'checkboxField', checked: true } },
      ).gizmo.checkboxField).toEqual(true);
    });

    test('it changes state properly for an integer field', () => {
      expect(stateChangeCalculator.getStateChangeForEvent(
        state,
        { target: { name: 'intField', value: '8675309' } },
      ).gizmo.intField).toEqual(8675309);
    });

    test('it changes state properly for a string field', () => {
      expect(stateChangeCalculator.getStateChangeForEvent(
        state,
        { target: { name: 'stringField', value: 'beef gyoza' } },
      ).gizmo.stringField).toEqual('beef gyoza');
    });
  });

  describe('getStateChangeForValueChange', () => {
    test('it changes state properly for a datetime field', () => {
      expect(stateChangeCalculator.getStateChangeForValueChange(
        state,
        'datetimeField',
        moment({
          year: '2017',
          month: '0',
          day: '1',
          hour: 12,
          minute: 0,
          second: 0,
        }),
      ).gizmo.datetimeField).toEqual('2017-01-01T17:00:00.000Z');
    });

    test('it changes state properly for a select multiple field', () => {
      expect(stateChangeCalculator.getStateChangeForValueChange(
        state,
        'selectMultipleField',
        [{ value: 'a' }, { value: 'c' }],
      ).gizmo.selectMultipleField).toEqual(['a', 'c']);
    });

    test('it changes state properly for a select field', () => {
      expect(stateChangeCalculator.getStateChangeForValueChange(
        state,
        'selectField',
        { value: 'c' },
      ).gizmo.selectField).toEqual('c');
    });

    test('it just throws the value in for anything else', () => {
      expect(stateChangeCalculator.getStateChangeForValueChange(
        state,
        'objectField',
        { a: 6 },
      ).gizmo.objectField).toEqual({ a: 6 });
    });
  });

  test('getMutator', () => {
    const getState = () => state;
    const setState = () => {};

    const mutator = stateChangeCalculator.getMutator(getState, setState);
    expect(mutator.stateChangeCalculator).toEqual(stateChangeCalculator);
    expect(mutator.getState).toEqual(getState);
    expect(mutator.setState).toEqual(setState);
  });

  test('getMutatorForComponent', () => {
    const component = {
      state,
      setState: () => {},
    };

    const mutator = stateChangeCalculator.getMutatorForComponent(component);
    expect(mutator.stateChangeCalculator).toEqual(stateChangeCalculator);
    expect(mutator.getState()).toEqual(state);
  });
});

describe('StateMutator', () => {
  const component = {
    state,

    setState(newState) {
      this.state = { ...this.state, ...newState };
    },
  };

  const mutator = FormUtils.StateMutator.forComponent(stateChangeCalculator, component);

  test('onInputChange', () => {
    mutator.onInputChange({ target: { name: 'checkboxField', checked: true } });
    expect(component.state.gizmo.checkboxField).toEqual(true);
  });

  test('onValueChange', () => {
    mutator.onValueChange('objectField', { differentField: 'value' });
    expect(component.state.gizmo.objectField).toEqual({ differentField: 'value' });
  });

  test('valueChangeCallback', () => {
    const callback = mutator.valueChangeCallback('objectField');
    callback({ thisIsNifty: true });
    expect(component.state.gizmo.objectField).toEqual({ thisIsNifty: true });
  });
});
