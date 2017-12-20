import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import sinon from 'sinon';
import Datetime from 'react-datetime';
import ScheduledValueTimespanRowDatepicker from '../../../app/javascript/BuiltInFormControls/ScheduledValueTimespanRowDatepicker';

describe('ScheduledValueTimespanRowDatepicker', () => {
  let onChange;

  beforeEach(() => {
    onChange = sinon.spy();
  });

  const renderScheduledValueTimespanRowDatepicker = props =>
    (shallow(<ScheduledValueTimespanRowDatepicker
      fieldName="nonsense"
      value={null}
      onChange={onChange}
      validateDate={() => true}
      {...props}
    />));

  test('it renders with a value', () => {
    const value = moment();
    const component = renderScheduledValueTimespanRowDatepicker({ value });
    expect(component.find(Datetime).prop('value')).toEqual(value);
  });

  test('onChange', () => {
    const newValue = moment();
    const component = renderScheduledValueTimespanRowDatepicker();
    component.find(Datetime).prop('onChange')(newValue);
    expect(onChange.getCall(0).args).toEqual(['nonsense', newValue]);
  });

  test('isValidDate', () => {
    const date = moment();
    const validateDate = sinon.spy();
    const component = renderScheduledValueTimespanRowDatepicker({ validateDate });
    component.find(Datetime).prop('isValidDate')(date);
    expect(validateDate.getCall(0).args).toEqual(['nonsense', date]);
  });
});
