import React, { useState, useCallback } from 'react';
import Modal from 'react-bootstrap4-modal';
import { ApolloError } from '@apollo/client';

import ErrorDisplay from '../ErrorDisplay';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import OrderPaymentForm, { PaymentDetails } from './OrderPaymentForm';
import paymentDetailsComplete from './paymentDetailsComplete';
import { LazyStripeElementsContainer } from '../LazyStripe';
import useAsyncFunction from '../useAsyncFunction';
import useSubmitOrder from './useSubmitOrder';
import formatMoney from '../formatMoney';
import { Money, PaymentMode } from '../graphqlTypes.generated';

// eslint-disable-next-line global-require
const PoweredByStripeLogo = require('../images/powered_by_stripe.svg').default as string;

type OrderPaymentModalContentsProps = {
  onCancel: () => void;
  onComplete: () => void;
  initialName?: string;
  orderId: number;
  paymentOptions: string[];
  totalPrice: Money;
};

function OrderPaymentModalContents({
  onCancel,
  onComplete,
  initialName,
  orderId,
  paymentOptions,
  totalPrice,
}: OrderPaymentModalContentsProps) {
  const [paymentMode, setPaymentMode] = useState<PaymentMode | undefined>(
    paymentOptions.includes('pay_at_convention') ? undefined : PaymentMode.Now,
  );
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({ name: initialName ?? '' });

  const submitOrder = useSubmitOrder();
  const [submitCheckOut, error, submitting] = useAsyncFunction(
    useCallback(async () => {
      const actualPaymentMode = totalPrice.fractional === 0 ? PaymentMode.Free : paymentMode;
      if (!actualPaymentMode) {
        throw new Error('Could not determine payment mode to use');
      }

      await submitOrder(orderId, actualPaymentMode, paymentDetails);
      onComplete();
    }, [onComplete, paymentMode, submitOrder, orderId, paymentDetails, totalPrice]),
  );

  const disabled =
    !paymentMode ||
    submitting ||
    (paymentMode === 'now' && !paymentDetailsComplete(paymentDetails));

  const renderCheckOutModalContent = () => {
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
          onChange={(newPaymentMode: string) => {
            setPaymentMode(newPaymentMode as PaymentMode);
          }}
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
        {paymentMode === 'now' ? (
          <>
            <OrderPaymentForm
              paymentDetails={paymentDetails}
              onChange={setPaymentDetails}
              disabled={submitting}
            />
          </>
        ) : null}
        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>
    );
  };

  return (
    <>
      <div className="modal-header lead">Checkout</div>
      {renderCheckOutModalContent()}
      <div className="modal-footer">
        <div className="d-flex align-items-center">
          <div className="col">
            {paymentMode === 'now' && totalPrice.fractional !== 0 ? (
              <img src={PoweredByStripeLogo} alt="Powered by Stripe" className="mr-4" />
            ) : null}
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
            {totalPrice.fractional === 0 ? 'Submit order (free)' : `Pay ${formatMoney(totalPrice)}`}
          </button>
        </div>
      </div>
    </>
  );
}

export type OrderPaymentModalProps = OrderPaymentModalContentsProps & {
  visible: boolean;
};

function OrderPaymentModal({
  visible,
  onCancel,
  onComplete,
  initialName,
  orderId,
  paymentOptions,
  totalPrice,
}: OrderPaymentModalProps) {
  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      {visible && (
        <LazyStripeElementsContainer>
          <OrderPaymentModalContents
            onCancel={onCancel}
            onComplete={onComplete}
            initialName={initialName}
            orderId={orderId}
            paymentOptions={paymentOptions}
            totalPrice={totalPrice}
          />
        </LazyStripeElementsContainer>
      )}
    </Modal>
  );
}

export default OrderPaymentModal;
