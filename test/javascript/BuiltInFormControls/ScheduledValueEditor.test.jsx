import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import moment from 'moment';
import buildTestScheduledValueInput from './buildTestScheduledValueInput';
import ScheduledValueEditor from '../../../app/javascript/BuiltInFormControls/ScheduledValueEditor';
import ScheduledValueTimespanRow from '../../../app/javascript/BuiltInFormControls/ScheduledValueTimespanRow';

describe('ScheduledValueEditor', () => {
  const renderScheduledValueEditor = props => mount((
    <ScheduledValueEditor
      scheduledValue={{ timespans: [] }}
      timezone="UTC"
      setScheduledValue={() => {}}
      buildValueInput={buildTestScheduledValueInput}
      {...props}
    />
  ));

  test('it renders the correct values', () => {
    const cutoff = moment();
    const component = renderScheduledValueEditor({
      scheduledValue: {
        timespans: [
          { value: 1, start: null, finish: cutoff.toISOString() },
          { value: 2, start: cutoff.toISOString(), finish: null },
        ],
      },
    });

    expect(component.find(ScheduledValueTimespanRow).length).toEqual(2);
    expect(component.find('input.testInput').map(input => input.props().value)).toEqual([1, 2]);
  });

  test('adding a row', () => {
    const setScheduledValue = sinon.spy();
    const component = renderScheduledValueEditor({ setScheduledValue });
    const button = component.find('button').filterWhere(b => b.text() === 'Add row');
    button.simulate('click');
    expect(setScheduledValue.getCall(0).args).toEqual([{
      timespans: [
        { value: null, start: null, finish: null },
      ],
    }]);
  });

  test('deleting a row', () => {
    const setScheduledValue = sinon.spy();
    const component = renderScheduledValueEditor({
      scheduledValue: {
        timespans: [
          { value: 'something', start: null, finish: null },
        ],
      },
      setScheduledValue,
    });
    component.find('.btn-danger').simulate('click');
    expect(setScheduledValue.getCall(0).args).toEqual([{
      timespans: [],
    }]);
  });

  test('changing something in a row', () => {
    const setScheduledValue = sinon.spy();
    const component = renderScheduledValueEditor({
      scheduledValue: {
        timespans: [
          { value: 'something', start: null, finish: null },
        ],
      },
      setScheduledValue,
    });
    component.find('input.testInput').simulate('change', { target: { value: 'something else' } });
    expect(setScheduledValue.getCall(0).args).toEqual([{
      timespans: [
        { value: 'something else', start: null, finish: null },
      ],
    }]);
  });

  describe('isValid', () => {
    test('it requires at least one timespan', () => {
      expect(ScheduledValueEditor.isValid({ timespans: null })).toBeFalsy();
      expect(ScheduledValueEditor.isValid({ timespans: [] })).toBeFalsy();
      expect(ScheduledValueEditor.isValid({})).toBeFalsy();
    });

    test('it requires every timespan have a value', () => {
      expect(ScheduledValueEditor.isValid({
        timespans: [{ start: null, finish: null, value: null }],
      })).toBeFalsy();

      expect(ScheduledValueEditor.isValid({
        timespans: [
          { start: null, finish: null, value: null },
          { start: null, finish: null, value: 6 },
        ],
      })).toBeFalsy();
    });

    test('it passes if every timespan has a value', () => {
      expect(ScheduledValueEditor.isValid({
        timespans: [
          { start: null, finish: null, value: 6 },
        ],
      })).toBeTruthy();
    });
  });
});
