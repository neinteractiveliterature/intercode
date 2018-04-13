import React from 'react';
import PropTypes from 'prop-types';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { ModelStateChangeCalculator, FIELD_TYPES } from '../FormUtils';
import PaymentEntry from '../BuiltInFormControls/PaymentEntry';

class OrderPaymentForm extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
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
      name: FIELD_TYPES.STRING,
      ccNumber: FIELD_TYPES.STRING,
      cvc: FIELD_TYPES.STRING,
      expMonth: FIELD_TYPES.STRING,
      expYear: FIELD_TYPES.STRING,
      zip: FIELD_TYPES.STRING,
    }).getMutatorForStatelessComponent(this, this.props.onChange);
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
          onCcNumberChanged={this.mutator.onInputChange}
          onExpMonthChanged={this.mutator.onInputChange}
          onExpYearChanged={this.mutator.onInputChange}
          onCvcChanged={this.mutator.onInputChange}
          onZipChanged={this.mutator.onInputChange}
          disabled={disabled}
        />
      </div>
    );
  }
}

export default OrderPaymentForm;
