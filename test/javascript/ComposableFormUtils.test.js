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
    shouldntChange: Transforms.integer,
    intField: Transforms.integer,
    booleanField: Transforms.booleanString,
    datetimeField: Transforms.datetime,
    datetimeEasternField: Transforms.datetimeWithTimezone('America/New_York'),
    selectMultipleField: Transforms.multiValue,
    objectField: Transforms.identity,
  },
};

describe('state change calculators', () => {
  const stateChangeCalculator = combineStateChangeCalculators(transforms);

  test('it changes state properly for a boolean field', () => {
    expect(stateChangeCalculator.gizmo.booleanField(
      state,
      'true',
    ).gizmo.booleanField).toEqual(true);

    expect(stateChangeCalculator.gizmo.booleanField(
      state,
      'false',
    ).gizmo.booleanField).toEqual(false);
  });

  test('it changes state properly for an integer field', () => {
    expect(stateChangeCalculator.gizmo.intField(
      state,
      '8675309',
    ).gizmo.intField).toEqual(8675309);
  });

  test('it changes state properly for a datetime field', () => {
    expect(stateChangeCalculator.gizmo.datetimeField(
      state,
      '2017-01-01T17:00:00.000Z',
    ).gizmo.datetimeField).toEqual('2017-01-01T17:00:00.000+00:00');
  });

  test('it changes state properly for a timezoned datetime field', () => {
    expect(stateChangeCalculator.gizmo.datetimeEasternField(
      state,
      '2017-01-01T17:00:00.000Z',
    ).gizmo.datetimeEasternField).toEqual('2017-01-01T12:00:00.000-05:00');
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
      setState: (value) => { mutableState = { ...mutableState, ...value }; },
      transforms,
    });

    beforeEach(() => {
      mutableState = { gizmo: { ...state.gizmo } };
    });

    test('it changes the appropriate state field', () => {
      theMutator.gizmo.objectField({ cookie: 'monster' });
      expect(mutableState.gizmo.objectField).toEqual({ cookie: 'monster' });
    });

    test('it does not change the others', () => {
      theMutator.gizmo.objectField({ big: 'bird' });
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
      theMutator.gizmo.objectField({ cookie: 'monster' });
      expect(component.state.gizmo.objectField).toEqual({ cookie: 'monster' });
    });

    test('it does not change the others', () => {
      theMutator.gizmo.objectField({ big: 'bird' });
      expect(component.state.gizmo.shouldntChange).toEqual(1);
    });
  });
});
