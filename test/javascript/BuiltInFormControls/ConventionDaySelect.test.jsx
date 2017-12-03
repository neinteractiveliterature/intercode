import React from 'react';
import sinon from 'sinon';
import moment from 'moment';
import { mount } from 'enzyme';
import ConventionDaySelect from '../../../app/javascript/BuiltInFormControls/ConventionDaySelect';

describe('ConventionDaySelect', () => {
  const onChange = sinon.spy();

  const renderConventionDaySelect = props => mount(<ConventionDaySelect
    convention={{
      starts_at: '2017-01-01T00:00:00.000Z',
      ends_at: '2017-01-04T00:00:00.000Z',
      timezone_name: 'UTC',
    }}
    onChange={onChange}
    {...props}
  />);

  test('it renders an option for each convention day', () => {
    const component = renderConventionDaySelect();
    expect(component.find('input').map(input => input.prop('value'))).toEqual([
      '2017-01-01T00:00:00.000Z',
      '2017-01-02T00:00:00.000Z',
      '2017-01-03T00:00:00.000Z',
    ]);
  });

  test('the value is selected', () => {
    const component = renderConventionDaySelect({ value: moment('2017-01-02T00:00:00.000Z') });
    expect(component.find('input').filter({ checked: true }).map(input => input.prop('value'))).toEqual([
      '2017-01-02T00:00:00.000Z',
    ]);
  });

  test('it calls onChange when a value is selected', () => {
    const component = renderConventionDaySelect();
    component.find('input').filter({ value: '2017-01-03T00:00:00.000Z' }).simulate('change');
    expect(onChange.calledOnce).toBeTruthy();
    expect(onChange.getCall(0).args[0].date()).toEqual(3);
  });
});
