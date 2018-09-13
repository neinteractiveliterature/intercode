import React from 'react';
import PropTypes from 'prop-types';
import { CardElement } from 'react-stripe-elements';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { ModelStateChangeCalculator, FIELD_TYPES } from '../FormUtils';

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
    }).getMutatorForStatelessComponent(this, this.props.onChange);
  }

  render = () => {
    const { disabled } = this.props;
    return (
      <div>
        <BootstrapFormInput
          name="name"
          label="Name"
          onChange={this.mutator.onInputChange}
          value={this.props.paymentDetails.name}
        />

        <CardElement
          className="form-control mb-4"
          disabled={disabled}
          style={{
            base: {
              lineHeight: 1.5,
              fontSize: '16px',
            },
          }}
        />
      </div>
    );
  }
}

export default OrderPaymentForm;
