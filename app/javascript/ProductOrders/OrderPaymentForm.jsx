/* global Stripe */

import React from 'react';
import PropTypes from 'prop-types';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { ModelStateChangeCalculator, FIELD_TYPES } from '../FormUtils';
import PaymentEntry from '../BuiltInFormControls/PaymentEntry';

class OrderPaymentForm extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    payOrder: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    paymentDetails: PropTypes.shape({
      name: PropTypes.string.isRequired,
      ccNumber: PropTypes.string.isRequired,
      cvc: PropTypes.string.isRequired,
      expMonth: PropTypes.string.isRequired,
      expYear: PropTypes.string.isRequired,
      zip: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.mutator = new ModelStateChangeCalculator('paymentDetails', {
      name: FIELD_TYPES.string,
      ccNumber: FIELD_TYPES.string,
      cvc: FIELD_TYPES.string,
      expMonth: FIELD_TYPES.string,
      expYear: FIELD_TYPES.string,
      zip: FIELD_TYPES.string,
    }).getMutatorForStatelessComponent(this, this.props.onChange);
  }

  submitPayment = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const missingFields = [
      'ccNumber',
      'cvc',
      'expMonth',
      'expYear',
      'zip',
      'name',
    ].filter(field => !this.state[field]);

    if (missingFields.length > 0) {
      this.setState({ paymentError: 'Please fill out all the fields in this form.' });
      return;
    }

    this.setState({ submitting: true });

    Stripe.card.createToken({
      number: this.state.ccNumber,
      cvc: this.state.cvc,
      exp_month: this.state.expMonth,
      exp_year: this.state.expYear,
      name: this.state.name,
      address_zip: this.state.zip,
    }, this.handleStripeResponse);
  }

  handleStripeResponse = async (status, response) => {
    if (response.error) {
      this.setState({
        paymentError: response.error.message,
        submitting: false,
      });
    } else {
      this.setState({ stripeToken: response.id });

      try {
        await this.props.payOrder(this.state.stripeToken);
      } catch (error) {
        this.setState({
          graphQLError: error,
          submitting: false,
        });
      }
    }
  }

  renderSubmittingSpinner = () => {
    if (!this.state.submitting) {
      return null;
    }

    return <i className="fa fa-spinner fa-spin" />;
  }

  render = () => {
    const { disabled } = this.props;
    return (
      <div>
        <BootstrapFormInput
          name="name"
          label="Name"
          onChange={this.mutator.valueChangeCallback('name')}
          value={this.props.paymentDetails.name}
        />

        <PaymentEntry
          ccNumber={this.props.paymentDetails.ccNumber}
          expMonth={this.props.paymentDetails.expMonth}
          expYear={this.props.paymentDetails.expYear}
          cvc={this.props.paymentDetails.cvc}
          zip={this.props.paymentDetails.zip}
          onCcNumberChanged={this.mutator.valueChangeCallback('ccNumber')}
          onExpMonthChanged={this.mutator.valueChangeCallback('expMonth')}
          onExpYearChanged={this.mutator.valueChangeCallback('expYear')}
          onCvcChanged={this.mutator.valueChangeCallback('cvc')}
          onZipChanged={this.mutator.valueChangeCallback('zip')}
          disabled={disabled}
        />
      </div>
    );
  }
}

export default OrderPaymentForm;
