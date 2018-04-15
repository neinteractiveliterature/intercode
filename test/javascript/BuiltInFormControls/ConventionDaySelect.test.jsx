import React from 'react';
import moment from 'moment';
import { mount } from 'enzyme';
import ConventionDaySelect from '../../../app/javascript/BuiltInFormControls/ConventionDaySelect';

describe('ConventionDaySelect', () => {
  const onChange = jest.fn();
  beforeEach(onChange.mockReset);

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
    expect(onChange.mock.calls).toHaveLength(1);
    expect(onChange.mock.calls[0][0].date()).toEqual(3);
  });
});
