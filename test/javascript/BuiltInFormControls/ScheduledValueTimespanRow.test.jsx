import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import moment from 'moment';
import buildTestScheduledValueInput from './buildTestScheduledValueInput';
import ScheduledValueTimespanRow from '../../../app/javascript/BuiltInFormControls/ScheduledValueTimespanRow';
import ScheduledValueTimespanRowDatepicker from '../../../app/javascript/BuiltInFormControls/ScheduledValueTimespanRowDatepicker';

describe('ScheduledValueTimespanRow', () => {
  let attributeDidChange;
  let deleteClicked;

  const timespanStart = '2017-01-01T00:00:00Z';
  const timespanFinish = '2017-01-02T00:00:00Z';

  beforeEach(() => {
    attributeDidChange = sinon.spy();
    deleteClicked = sinon.spy();
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
    expect(attributeDidChange.getCall(0).args).toEqual([42, 'value', 'newvalue']);
  });

  test.skip('overlap checking', () => {
    const otherTimespans = [
      {
        start: timespanFinish,
        finish: '2017-01-03T00:00:00Z',
        value: 'afteryou',
      },
    ];
    const component = renderScheduledValueTimespanRow({ otherTimespans });
    expect(component.find('Datetime').at(1).prop('isValidDate')(moment(otherTimespans[0].finish))).toBeFalsy();
  });

  test.skip('range orientation checking', () => {
    const onlyStartSet = renderScheduledValueTimespanRow({}, {
      start: timespanFinish,
      finish: null,
    });
    const onlyFinishSet = renderScheduledValueTimespanRow({}, {
      start: null,
      finish: timespanStart,
    });

    expect(onlyStartSet.find('Datetime').at(1).prop('isValidDate')(moment(timespanStart))).toBeFalsy();
    expect(onlyFinishSet.find('Datetime').at(0).prop('isValidDate')(moment(timespanFinish))).toBeFalsy();
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
