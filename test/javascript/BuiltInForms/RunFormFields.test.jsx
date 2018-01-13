import React from 'react';
import { mount } from 'enzyme';
import Select from 'react-select';
import BootstrapFormInput from '../../../app/javascript/BuiltInFormControls/BootstrapFormInput';
import ConventionDaySelect from '../../../app/javascript/BuiltInFormControls/ConventionDaySelect';
import RunFormFields from '../../../app/javascript/BuiltInForms/RunFormFields';
import sampleRooms from './sampleRooms';
import TimeSelect from '../../../app/javascript/BuiltInFormControls/TimeSelect';

describe('RunFormFields', () => {
  const renderRunFormFields = (props, runProps) => mount((
    <RunFormFields
      run={{ ...runProps }}
      event={{ length_seconds: 3600 }}
      convention={{
        starts_at: '2017-01-01T00:00:00Z',
        ends_at: '2017-01-02T00:00:00Z',
        timezone_name: 'UTC',
        rooms: sampleRooms,
      }}
      onChange={() => {}}
      {...props}
    />
  ));

  test('it renders values correctly', () => {
    const component = renderRunFormFields({}, {
      starts_at: '2017-01-01T06:00:00Z',
      title_suffix: 'myTitleSuffix',
      schedule_note: 'myScheduleNote',
      rooms: sampleRooms,
    });

    expect(component.find(ConventionDaySelect).prop('value').toISOString()).toEqual('2017-01-01T00:00:00.000Z');
    expect(component.find(TimeSelect).prop('value')).toEqual({ hour: 6, minute: 0 });
    expect(component.find(BootstrapFormInput).filter({ name: 'title_suffix' }).prop('value')).toEqual('myTitleSuffix');
    expect(component.find(BootstrapFormInput).filter({ name: 'schedule_note' }).prop('value')).toEqual('myScheduleNote');
    expect(component.find(Select).prop('value')).toEqual([1, 2]);
  });

  test('changing the day and time', () => {
    const onChange = jest.fn();
    const component = renderRunFormFields({ onChange });
    expect(component.find(TimeSelect).length).toEqual(0);

    const dayRadio = component.find(ConventionDaySelect).find({ value: '2017-01-01T00:00:00.000Z' });
    dayRadio.simulate('change', { target: { name: dayRadio.prop('name'), value: dayRadio.prop('value') } });
    expect(component.find(TimeSelect).length).toEqual(1);
    expect(onChange.mock.calls[0][0].starts_at).toBeNull();
    expect(component.find(TimeSelect).prop('children')).toBeNull();

    const [hourSelect, minuteSelect] = component.find(TimeSelect).find('select').map(e => e);
    hourSelect.simulate('change', { target: { name: hourSelect.prop('name'), value: '6' } });
    expect(onChange.mock.calls[1][0].starts_at).toBeNull();
    expect(component.find(TimeSelect).prop('children')).toBeNull();

    minuteSelect.simulate('change', { target: { name: minuteSelect.prop('name'), value: '0' } });
    expect(onChange.mock.calls[2][0].starts_at).toEqual('2017-01-01T06:00:00.000Z');
    expect(component.find(TimeSelect).prop('children')).toEqual('- 7:00');
  });

  test('changing text fields', () => {
    const onChange = jest.fn();
    const component = renderRunFormFields({ onChange });
    component.find('input').filter({ name: 'title_suffix' })
      .simulate('change', { target: { name: 'title_suffix', value: 'suffiximo' } });
    expect(onChange.mock.calls[0][0].title_suffix).toEqual('suffiximo');
  });
});
