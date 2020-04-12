import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { injectStripe } from 'react-stripe-elements';

import ErrorDisplay from '../ErrorDisplay';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import OrderPaymentForm from './OrderPaymentForm';
import paymentDetailsComplete from './paymentDetailsComplete';
import PoweredByStripeLogo from '../images/powered_by_stripe.svg';
import { LazyStripeElementsWrapper } from '../LazyStripe';
import useAsyncFunction from '../useAsyncFunction';
import useSubmitOrder from './useSubmitOrder';
import formatMoney from '../formatMoney';

function OrderPaymentModal({
  visible, onCancel, onComplete, initialName, orderId, paymentOptions, stripe, totalPrice,
}) {
  const [paymentMode, setPaymentMode] = useState(
    paymentOptions.includes('pay_at_convention') ? null : 'now',
  );
  const [paymentDetails, setPaymentDetails] = useState({ name: initialName || '' });

  const submitOrder = useSubmitOrder(stripe);
  const [submitCheckOut, error, submitting] = useAsyncFunction(useCallback(
    async () => {
      await submitOrder(orderId, paymentMode, paymentDetails);
      onComplete();
    },
    [onComplete, paymentMode, submitOrder, orderId, paymentDetails],
  ));

  const disabled = !paymentMode || submitting || (
    paymentMode === 'now' && !paymentDetailsComplete(paymentDetails)
  );

  const renderCheckOutModalContent = () => {
    if (!visible) {
      return null;
    }

    if (totalPrice.fractional === 0) {
      return <div className="modal-body">Your order is free.</div>;
    }

    let paymentModeSelect = null;

    if (paymentOptions.includes('pay_at_convention')) {
      paymentModeSelect = (
        <MultipleChoiceInput
          name="paymentMode"
          caption="How would you like to pay for your order?"
          value={paymentMode}
          onChange={setPaymentMode}
          choices={[
            { value: 'now', label: 'Pay now with a credit card' },
            { value: 'later', label: 'Pay at the convention' },
          ]}
        />
      );
    }

    return (
      <div className="modal-body">
        {paymentModeSelect}
        {
          paymentMode === 'now'
            ? (
              <OrderPaymentForm
                paymentDetails={paymentDetails}
                onChange={setPaymentDetails}
                disabled={submitting}
              />
            )
            : null
        }
        <ErrorDisplay graphQLError={error} />
      </div>
    );
  };

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header lead">Checkout</div>
      {renderCheckOutModalContent()}
      <div className="modal-footer">
        <div className="d-flex align-items-center">
          <div className="col">
            {
              paymentMode === 'now' && totalPrice.fractional !== 0
                ? (
                  <img src={PoweredByStripeLogo} alt="Powered by Stripe" className="mr-4" />
                ) : null
            }
          </div>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={submitCheckOut}
            disabled={disabled}
          >
            {totalPrice.fractional === 0
              ? 'Submit order (free)'
              : `Pay ${formatMoney(totalPrice)}`}
          </button>
        </div>
      </div>
    </Modal>
  );
}

OrderPaymentModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  initialName: PropTypes.string,
  orderId: PropTypes.number.isRequired,
  paymentOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  stripe: PropTypes.shape({
    createToken: PropTypes.func.isRequired,
  }),
  totalPrice: PropTypes.shape({
    fractional: PropTypes.number,
  }).isRequired,
};

OrderPaymentModal.defaultProps = {
  initialName: '',
  stripe: null, // injectStripe is going to inject it soon after page load
};

export default LazyStripeElementsWrapper(injectStripe(OrderPaymentModal));
