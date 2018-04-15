import React from 'react';
import { mount } from 'enzyme';
import CreditCardNumberInput from '../../../app/javascript/BuiltInFormControls/CreditCardNumberInput';

describe('CreditCardNumberInput', () => {
  const renderCreditCardNumberInput = props => mount(<CreditCardNumberInput
    id="ccNumber"
    onChange={() => {}}
    {...props}
  />);

  test('it renders a default credit card image when there is no value', () => {
    const component = renderCreditCardNumberInput();
    expect(component.find('.input-group-append i').prop('className')).toEqual('fa fa-credit-card');
  });

  test('it renders a Visa credit card image when it is a Visa card', () => {
    const component = renderCreditCardNumberInput({ value: '4242424242424242' });
    expect(component.find('.input-group-append i').prop('className')).toEqual('fa fa-cc-visa text-success');
  });

  test('it renders a MasterCard credit card image when it is a MasterCard card', () => {
    const component = renderCreditCardNumberInput({ value: '5555555555554444' });
    expect(component.find('.input-group-append i').prop('className')).toEqual('fa fa-cc-mastercard text-success');
  });

  test('it renders an Amex credit card image when it is an Amex card', () => {
    const component = renderCreditCardNumberInput({ value: '378282246310005' });
    expect(component.find('.input-group-append i').prop('className')).toEqual('fa fa-cc-amex text-success');
  });

  test('it renders a Discover credit card image when it is a Discover card', () => {
    const component = renderCreditCardNumberInput({ value: '6011111111111117' });
    expect(component.find('.input-group-append i').prop('className')).toEqual('fa fa-cc-discover text-success');
  });

  test('it renders a Diners Club credit card image when it is a Diners Club card', () => {
    const component = renderCreditCardNumberInput({ value: '30569309025904' });
    expect(component.find('.input-group-append i').prop('className')).toEqual('fa fa-cc-dinersclub text-success');
  });

  test('it renders a JCB credit card image when it is a JCB card', () => {
    const component = renderCreditCardNumberInput({ value: '3530111333300000' });
    expect(component.find('.input-group-append i').prop('className')).toEqual('fa fa-cc-jcb text-success');
  });

  test('it renders a black icon when it is a partial card number', () => {
    const component = renderCreditCardNumberInput({ value: '42424242424242' });
    expect(component.find('.input-group-append i').prop('className')).toEqual('fa fa-cc-visa');
  });

  test('it renders an error icon when it is an invalid card number', () => {
    const component = renderCreditCardNumberInput({ value: '4242424242424243' });
    expect(component.find('.input-group-append i').prop('className')).toEqual('fa fa-exclamation-triangle text-danger');
  });
});
