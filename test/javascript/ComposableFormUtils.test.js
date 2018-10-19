import { mutator, combineStateChangeCalculators, Transforms } from '../../app/javascript/ComposableFormUtils';

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

const transforms = {
  gizmo: {
    shouldntChange: Transforms.inputChange(Transforms.integer),
    intField: Transforms.inputChange(Transforms.integer),
    stringField: Transforms.textInputChange,
    booleanField: Transforms.inputChange(Transforms.booleanString),
    checkboxField: Transforms.checkboxChange,
    datetimeField: Transforms.inputChange(Transforms.datetime),
    datetimeEasternField: Transforms.inputChange(Transforms.datetimeWithTimezone('US/Eastern')),
    datetimeForceEasternField: Transforms.inputChange(Transforms.datetimeWithForcedTimezone('US/Eastern')),
    selectMultipleField: Transforms.multiValue,
    objectField: Transforms.identity,
  },
};

describe('state change calculators', () => {
  const stateChangeCalculator = combineStateChangeCalculators(transforms);

  test('it changes state properly for a boolean field', () => {
    expect(stateChangeCalculator.gizmo.booleanField(
      state,
      { target: { name: 'booleanField', value: 'true' } },
    ).gizmo.booleanField).toEqual(true);

    expect(stateChangeCalculator.gizmo.booleanField(
      state,
      { target: { name: 'booleanField', value: 'false' } },
    ).gizmo.booleanField).toEqual(false);
  });

  test('it changes state properly for a checkbox field', () => {
    expect(stateChangeCalculator.gizmo.checkboxField(
      state,
      { target: { name: 'checkboxField', checked: true } },
    ).gizmo.checkboxField).toEqual(true);
  });

  test('it changes state properly for an integer field', () => {
    expect(stateChangeCalculator.gizmo.intField(
      state,
      { target: { name: 'intField', value: '8675309' } },
    ).gizmo.intField).toEqual(8675309);
  });

  test('it changes state properly for a string field', () => {
    expect(stateChangeCalculator.gizmo.stringField(
      state,
      { target: { name: 'stringField', value: 'beef gyoza' } },
    ).gizmo.stringField).toEqual('beef gyoza');
  });

  test('it changes state properly for a datetime field', () => {
    expect(stateChangeCalculator.gizmo.datetimeField(
      state,
      { target: { name: 'datetimeField', value: '2017-01-01T17:00:00.000Z' } },
    ).gizmo.datetimeField).toEqual('2017-01-01T17:00:00.000Z');
  });

  test('it changes state properly for a timezoned datetime field', () => {
    expect(stateChangeCalculator.gizmo.datetimeEasternField(
      state,
      { target: { name: 'datetimeField', value: '2017-01-01T17:00:00.000Z' } },
    ).gizmo.datetimeEasternField).toEqual('2017-01-01T12:00:00.000-05:00');
  });

  test('it changes state properly for a forced-timezone datetime field', () => {
    expect(stateChangeCalculator.gizmo.datetimeForceEasternField(
      state,
      { target: { name: 'datetimeField', value: '2017-01-01T17:00:00.000Z' } },
    ).gizmo.datetimeForceEasternField).toEqual('2017-01-01T17:00:00.000-05:00');
  });

  test('it changes state properly for a select multiple field', () => {
    expect(stateChangeCalculator.gizmo.selectMultipleField(
      state,
      [{ value: 'a' }, { value: 'c' }],
    ).gizmo.selectMultipleField).toEqual(['a', 'c']);
  });

  test('it just throws the value in for anything else', () => {
    expect(stateChangeCalculator.gizmo.objectField(
      state,
      { a: 6 },
    ).gizmo.objectField).toEqual({ a: 6 });
  });
});

describe('mutator', () => {
  describe('with getState/setState', () => {
    let mutableState;

    const theMutator = mutator({
      getState: () => mutableState,
      setState: (value) => { mutableState = { ...mutableState, ...value } },
      transforms,
    });

    beforeEach(() => {
      mutableState = { gizmo: { ...state.gizmo } };
    });

    test('it changes the appropriate state field', () => {
      theMutator.gizmo.checkboxField({ target: { name: 'checkboxField', checked: true } });
      expect(mutableState.gizmo.checkboxField).toEqual(true);
    });

    test('it does not change the others', () => {
      theMutator.gizmo.checkboxField({ target: { name: 'checkboxField', checked: true } });
      expect(mutableState.gizmo.shouldntChange).toEqual(1);
    });
  });

  describe('with component', () => {
    const component = {
      setState(newState) {
        this.state = { ...this.state, ...newState };
      },
    };

    const theMutator = mutator({
      component,
      transforms,
    });

    beforeEach(() => {
      component.state = { gizmo: { ...state.gizmo } };
    });

    test('it changes the appropriate state field', () => {
      theMutator.gizmo.checkboxField({ target: { name: 'checkboxField', checked: true } });
      expect(component.state.gizmo.checkboxField).toEqual(true);
    });

    test('it does not change the others', () => {
      theMutator.gizmo.checkboxField({ target: { name: 'checkboxField', checked: true } });
      expect(component.state.gizmo.shouldntChange).toEqual(1);
    });
  });
});
