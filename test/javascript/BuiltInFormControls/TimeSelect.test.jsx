import React from 'react';
import sinon from 'sinon';
import moment from 'moment-timezone';
import { shallow } from 'enzyme';
import TimeSelect from '../../../app/javascript/BuiltInFormControls/TimeSelect';

describe('TimeSelect', () => {
  const renderTimeSelect = props => shallow((
    <TimeSelect
      value={{}}
      onChange={() => {}}
      timespan={{
        start: moment.tz('2017-01-01T00:00:00Z', 'UTC'),
        finish: moment.tz('2017-01-02T00:00:00Z', 'UTC'),
      }}
      {...props}
    />
  ));

  test('it renders the correct options', () => {
    const component = renderTimeSelect();
    expect(component.find('select').at(0).find('option').map(option => option.text())).toEqual([
      '',
      ...([...Array(24).keys()].map(hour => hour.toString())),
    ]);
    expect(component.find('select').at(1).find('option').map(option => option.text())).toEqual([
      '', '00', '15', '30', '45',
    ]);
  });

  test('it renders +days options', () => {
    const component = renderTimeSelect({
      timespan: {
        start: moment.tz('2017-01-01T00:00:00Z', 'UTC'),
        finish: moment.tz('2017-01-04T00:00:00Z', 'UTC'),
      },
    });
    expect(component.find('select').at(0).find('option').map(option => option.text())).toEqual([
      '',
      ...([...Array(24).keys()].map(hour => hour.toString())),
      ...([...Array(24).keys()].map(hour => `${hour} (+1 day)`)),
      ...([...Array(24).keys()].map(hour => `${hour} (+2 days)`)),
    ]);
  });

  test('it renders a given value', () => {
    const component = renderTimeSelect({ value: { hour: 4, minute: 45 } });
    expect(component.find('select').at(0).prop('value')).toEqual(4);
    expect(component.find('select').at(1).prop('value')).toEqual(45);
  });

  describe('onChange', () => {
    test('it changes a field', () => {
      const onChange = sinon.spy();
      const component = renderTimeSelect({ onChange });
      const hourSelect = component.find('select').at(0);
      hourSelect.simulate('change', { target: { value: '3', name: hourSelect.prop('name') } });
      expect(onChange.getCall(0).args).toEqual([{ hour: 3 }]);
    });

    test('it clears a field', () => {
      const onChange = sinon.spy();
      const component = renderTimeSelect({ value: { hour: 3, minute: 45 }, onChange });
      const hourSelect = component.find('select').at(0);
      hourSelect.simulate('change', { target: { value: '', name: hourSelect.prop('name') } });
      expect(onChange.getCall(0).args).toEqual([{ hour: null, minute: 45 }]);
    });
  });
});
