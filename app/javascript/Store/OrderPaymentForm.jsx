import React from 'react';
import PropTypes from 'prop-types';
import { CardElement } from 'react-stripe-elements';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';

function OrderPaymentForm({ disabled, onChange, paymentDetails }) {
  return (
    <div>
      <BootstrapFormInput
        name="name"
        label="Name"
        value={paymentDetails.name}
        onTextChange={(name) => onChange({ ...paymentDetails, name })}
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
