import { useState, useCallback, useEffect } from 'react';
import Modal from 'react-bootstrap4-modal';
import { ApolloError, useApolloClient } from '@apollo/client';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { PaymentRequest, PaymentRequestPaymentMethodEvent } from '@stripe/stripe-js';
import {
  ErrorDisplay,
  MultipleChoiceInput,
  PageLoadingIndicator,
} from '@neinteractiveliterature/litform';

import OrderPaymentForm, { PaymentDetails } from './OrderPaymentForm';
import paymentDetailsComplete from './paymentDetailsComplete';
import { LazyStripeElementsContainer } from '../LazyStripe';
import useAsyncFunction from '../useAsyncFunction';
import useSubmitOrder from './useSubmitOrder';
import formatMoney from '../formatMoney';
import { Money, PaymentMode } from '../graphqlTypes.generated';
import { CurrentPendingOrderPaymentIntentClientSecretQueryData } from './queries.generated';
import { CurrentPendingOrderPaymentIntentClientSecret } from './queries';

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
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>();
  const [awaitingPaymentRequestResult, setAwaitingPaymentRequestResult] = useState(false);
  const [choseManualCardEntry, setChoseManualCardEntry] = useState(false);
  const apolloClient = useApolloClient();
  const submitOrder = useSubmitOrder();

  const onPaymentMethod = useCallback(
    async (ev: PaymentRequestPaymentMethodEvent) => {
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      const detailsFromEvent: PaymentDetails = {
        name: ev.payerName!,
      };

      let clientSecret: string = '';

      try {
        const {
          data,
        } = await apolloClient.query<CurrentPendingOrderPaymentIntentClientSecretQueryData>({
          query: CurrentPendingOrderPaymentIntentClientSecret,
        });

        clientSecret = data.currentPendingOrderPaymentIntentClientSecret;
      } catch (error) {
        ev.complete('fail');
      }

      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: ev.paymentMethod.id },
        { handleActions: false },
      );

      if (confirmError || !paymentIntent) {
        ev.complete('fail');
      } else {
        ev.complete('success');

        if (paymentIntent.status === 'requires_action') {
          const { error } = await stripe.confirmCardPayment(clientSecret);
          if (error) {
            throw new Error(error.message);
          } else {
            await submitOrder(orderId, PaymentMode.PaymentIntent, detailsFromEvent, paymentIntent);
            onComplete();
          }
        } else {
          await submitOrder(orderId, PaymentMode.PaymentIntent, detailsFromEvent, paymentIntent);
          onComplete();
        }
      }
    },
    [apolloClient, onComplete, orderId, stripe, submitOrder],
  );

  useEffect(() => {
    if (stripe && paymentMode === 'now' && totalPrice.fractional !== 0) {
      setAwaitingPaymentRequestResult(true);

      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Total',
          amount: totalPrice.fractional,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: false,
        requestShipping: false,
      });

      pr.canMakePayment()
        .then(async (result) => {
          setAwaitingPaymentRequestResult(false);

          if (result) {
            setPaymentRequest(pr);

            pr.on('paymentmethod', onPaymentMethod);
          }
        })
        .catch(() => {
          setAwaitingPaymentRequestResult(false);
        });
    }
  }, [stripe, totalPrice, onPaymentMethod, paymentMode]);

  const [submitCheckOut, error, submitting] = useAsyncFunction(
    useCallback(async () => {
      const actualPaymentMode = totalPrice.fractional === 0 ? PaymentMode.Free : paymentMode;
      if (!actualPaymentMode) {
        throw new Error('Could not determine payment mode to use');
      }

      await submitOrder(orderId, actualPaymentMode, paymentDetails);
      onComplete();
    }, [onComplete, paymentMode, submitOrder, orderId, paymentDetails, totalPrice]),
    { suppressError: true },
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
            {awaitingPaymentRequestResult ? (
              <PageLoadingIndicator visible />
            ) : (
              <>
                {(!paymentRequest || choseManualCardEntry) && (
                  <OrderPaymentForm
                    paymentDetails={paymentDetails}
                    onChange={setPaymentDetails}
                    disabled={submitting}
                  />
                )}
                {paymentRequest && !choseManualCardEntry && (
                  <>
                    <PaymentRequestButtonElement options={{ paymentRequest }} />
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => setChoseManualCardEntry(true)}
                    >
                      Or, enter card details manually
                    </button>
                  </>
                )}
              </>
            )}
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
              <img src={PoweredByStripeLogo} alt="Powered by Stripe" className="me-4" />
            ) : null}
          </div>
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          {awaitingPaymentRequestResult || (paymentRequest && !choseManualCardEntry) ? null : (
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
          )}
        </div>
      </div>
    </>
  );
}

export type OrderPaymentModalProps = Omit<OrderPaymentModalContentsProps, 'orderId'> & {
  visible: boolean;
  orderId?: OrderPaymentModalContentsProps['orderId'];
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
    <Modal visible={visible && orderId != null} dialogClassName="modal-lg">
      {visible && orderId != null && (
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
