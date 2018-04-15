import React from 'react';
import { mount } from 'enzyme';
import buildTestScheduledValueInput from './buildTestScheduledValueInput';
import ScheduledValueTimespanRow from '../../../app/javascript/BuiltInFormControls/ScheduledValueTimespanRow';

describe('ScheduledValueTimespanRow', () => {
  const attributeDidChange = jest.fn();
  const deleteClicked = jest.fn();

  const timespanStart = '2017-01-01T00:00:00Z';
  const timespanFinish = '2017-01-02T00:00:00Z';

  beforeEach(() => {
    attributeDidChange.mockReset();
    deleteClicked.mockReset();
  });

  const renderScheduledValueTimespanRow = (props, timespanProps) => {
    const timespan = {
      start: timespanStart,
      finish: timespanFinish,
      value: '',
      ...timespanProps,
    };

    return mount((
      <table>
        <tbody>
          <ScheduledValueTimespanRow
            buildInput={buildTestScheduledValueInput}
            rowIdentifier={42}
            timespan={timespan}
            otherTimespans={[]}
            timezone="UTC"
            attributeDidChange={attributeDidChange}
            deleteClicked={deleteClicked}
            {...props}
          />
        </tbody>
      </table>
    ));
  };

  test('it renders with a value', () => {
    const value = 'blooblah';
    const component = renderScheduledValueTimespanRow({}, { value });
    expect(component.find('input.testInput').prop('value')).toEqual(value);
  });

  test('changing value', () => {
    const component = renderScheduledValueTimespanRow();
    component.find('input.testInput').simulate('change', { target: { value: 'newvalue' } });
    expect(attributeDidChange).toHaveBeenCalledWith(42, 'value', 'newvalue');
  });

  describe('isValid', () => {
    test('it requires a value', () => {
      expect(ScheduledValueTimespanRow.isValid({})).toBeFalsy();
      expect(ScheduledValueTimespanRow.isValid({ value: null })).toBeFalsy();
      expect(ScheduledValueTimespanRow.isValid({ value: 6 })).toBeTruthy();
    });

    test('it does not require a start or a finish', () => {
      expect(ScheduledValueTimespanRow.isValid({
        value: 6,
        start: null,
        finish: null,
      })).toBeTruthy();
    });
  });
});
