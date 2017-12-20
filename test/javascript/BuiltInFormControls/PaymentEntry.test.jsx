import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import PaymentEntry from '../../../app/javascript/BuiltInFormControls/PaymentEntry';

describe('PaymentEntry', () => {
  const FIELDS = ['ccNumber', 'expMonth', 'expYear', 'cvc', 'zip'];
  let callbacks;

  beforeEach(() => {
    callbacks = Object.assign({}, ...FIELDS.map(field => ({ [field]: sinon.spy() })));
  });

  const renderPaymentEntry = props => mount(<PaymentEntry
    ccNumber=""
    cvc=""
    expMonth=""
    expYear=""
    zip=""
    onCcNumberChanged={callbacks.ccNumber}
    onExpMonthChanged={callbacks.expMonth}
    onExpYearChanged={callbacks.expYear}
    onCvcChanged={callbacks.cvc}
    onZipChanged={callbacks.zip}
    disabled={false}
    {...props}
  />);

  test('it renders values for the inputs', () => {
    const component = renderPaymentEntry({
      ccNumber: '12345678',
      cvc: '909',
      expMonth: '01',
      expYear: '2001',
      zip: '90210',
    });

    expect(component.find('input[name="ccNumber"]').prop('value')).toEqual('12345678');
    expect(component.find('input[name="cvc"]').prop('value')).toEqual('909');
    expect(component.find('input[name="expMonth"]').prop('value')).toEqual('01');
    expect(component.find('input[name="expYear"]').prop('value')).toEqual('2001');
    expect(component.find('input[name="zip"]').prop('value')).toEqual('90210');
  });

  FIELDS.forEach((field) => {
    test(`${field} change callback`, () => {
      const component = renderPaymentEntry();
      component.find(`input[name="${field}"]`).simulate('change', { target: { value: '123' } });
      expect(callbacks[field].getCall(0).args[0].target.value).toEqual('123');
    });
  });

  test('disabled', () => {
    const component = renderPaymentEntry({ disabled: true });
    FIELDS.forEach((field) => {
      expect(component.find(`input[name="${field}"]`).prop('disabled')).toBeTruthy();
    });
  });
});
