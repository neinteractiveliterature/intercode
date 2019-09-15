import React from 'react';
import PropTypes from 'prop-types';
import { CardElement } from 'react-stripe-elements';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { mutator, Transforms } from '../ComposableFormUtils';

class OrderPaymentForm extends React.Component {
  constructor(props) {
    super(props);

    this.mutator = mutator({
      getState: () => this.props.paymentDetails,
      setState: this.props.onChange,
      transforms: {
        name: Transforms.identity,
      },
    });
  }

  render = () => {
    const { disabled } = this.props;
    return (
      <div>
        <BootstrapFormInput
          name="name"
          label="Name"
          value={this.props.paymentDetails.name}
          onTextChange={this.mutator.name}
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

OrderPaymentForm.propTypes = {
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

export default OrderPaymentForm;
