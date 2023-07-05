import { useState, useCallback, useEffect, useMemo, useContext } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError, useApolloClient } from '@apollo/client';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { PaymentRequest, PaymentRequestPaymentMethodEvent } from '@stripe/stripe-js';
import { ErrorDisplay, MultipleChoiceInput, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import OrderPaymentForm, { PaymentDetails } from './OrderPaymentForm';
import paymentDetailsComplete from './paymentDetailsComplete';
import { LazyStripeElementsContainer } from '../LazyStripe';
import useAsyncFunction from '../useAsyncFunction';
import useSubmitOrder from './useSubmitOrder';
import formatMoney from '../formatMoney';
import { Order, PaymentMode, Product } from '../graphqlTypes.generated';
import {
  CurrentPendingOrderPaymentIntentClientSecretQueryData,
  CurrentPendingOrderPaymentIntentClientSecretQueryDocument,
} from './queries.generated';

import PoweredByStripeLogo from '../images/powered_by_stripe.svg';
import intersection from 'lodash/intersection';
import AppRootContext from '../AppRootContext';

export type OrderPaymentModalContentsProps = {
  onCancel: () => void;
  onComplete: () => void;
  order: Pick<Order, 'id' | 'total_price'> & {
    order_entries: {
      product: Pick<Product, 'payment_options'>;
    }[];
  };
};

export function OrderPaymentModalContents({ onCancel, onComplete, order }: OrderPaymentModalContentsProps) {
  const { myProfile } = useContext(AppRootContext);
  const totalPrice = useMemo(() => order.total_price, [order.total_price]);
  const paymentOptions = useMemo(
    () => intersection(...(order.order_entries ?? []).map((entry) => entry.product.payment_options)),
    [order.order_entries],
  );
  const [paymentMode, setPaymentMode] = useState<PaymentMode | undefined>(
    paymentOptions.includes('pay_at_convention') ? undefined : PaymentMode.Now,
  );
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    name: myProfile?.name_without_nickname ?? '',
  });
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
        name: ev.payerName ?? '',
      };

      let clientSecret = '';

      try {
        const { data } = await apolloClient.query<CurrentPendingOrderPaymentIntentClientSecretQueryData>({
          query: CurrentPendingOrderPaymentIntentClientSecretQueryDocument,
        });

        const myProfile = data.convention.my_profile;
        if (!myProfile) {
          throw new Error('Must be logged in to check out');
        }

        const currentPendingOrder = myProfile.current_pending_order;
        if (!currentPendingOrder) {
          throw new Error('There is no order in progress');
        }

        clientSecret = currentPendingOrder.payment_intent_client_secret;
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
            await submitOrder(order.id, PaymentMode.PaymentIntent, detailsFromEvent, paymentIntent);
            onComplete();
          }
        } else {
          await submitOrder(order.id, PaymentMode.PaymentIntent, detailsFromEvent, paymentIntent);
          onComplete();
        }
      }
    },
    [apolloClient, onComplete, order.id, stripe, submitOrder],
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

      await submitOrder(order.id, actualPaymentMode, paymentDetails);
      onComplete();
    }, [onComplete, paymentMode, submitOrder, order.id, paymentDetails, totalPrice]),
    { suppressError: true },
  );

  const disabled = !paymentMode || submitting || (paymentMode === 'now' && !paymentDetailsComplete(paymentDetails));

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
              <PageLoadingIndicator visible iconSet="bootstrap-icons" />
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
                    <button className="btn btn-link" type="button" onClick={() => setChoseManualCardEntry(true)}>
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
          <button type="button" className="btn btn-secondary me-2" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          {awaitingPaymentRequestResult || (paymentRequest && !choseManualCardEntry) ? null : (
            <button type="button" className="btn btn-primary" onClick={submitCheckOut} disabled={disabled}>
              {totalPrice.fractional === 0 ? 'Submit order (free)' : `Pay ${formatMoney(totalPrice)}`}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export type OrderPaymentModalProps = Omit<OrderPaymentModalContentsProps, 'order'> & {
  visible: boolean;
  order?: OrderPaymentModalContentsProps['order'];
};

function OrderPaymentModal({ visible, onCancel, onComplete, order }: OrderPaymentModalProps): JSX.Element {
  return (
    <Modal visible={visible && order != null} dialogClassName="modal-lg">
      {visible && order != null && (
        <LazyStripeElementsContainer>
          <OrderPaymentModalContents onCancel={onCancel} onComplete={onComplete} order={order} />
        </LazyStripeElementsContainer>
      )}
    </Modal>
  );
}

export default OrderPaymentModal;
