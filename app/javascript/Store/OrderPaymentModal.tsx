import { useState, useCallback, useMemo, useContext } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError, useSuspenseQuery } from '@apollo/client';
import { LinkAuthenticationElement, PaymentElement } from '@stripe/react-stripe-js';
import { ErrorDisplay, MultipleChoiceInput } from '@neinteractiveliterature/litform';

import { LazyStripeElementsContainer } from '../LazyStripe';
import useAsyncFunction from '../useAsyncFunction';
import useSubmitOrder from './useSubmitOrder';
import formatMoney from '../formatMoney';
import { Order, PaymentMode, Product } from '../graphqlTypes.generated';

import PoweredByStripeLogo from '../images/powered_by_stripe.svg';
import intersection from 'lodash/intersection';
import { useTranslation } from 'react-i18next';
import AppRootContext from '../AppRootContext';
import { CurrentPendingOrderPaymentIntentClientSecretQueryDocument } from './queries.generated';

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
  const { t } = useTranslation();
  const totalPrice = useMemo(() => order.total_price, [order.total_price]);
  const paymentOptions = useMemo(
    () => intersection(...(order.order_entries ?? []).map((entry) => entry.product.payment_options)),
    [order.order_entries],
  );
  const [paymentMode, setPaymentMode] = useState<PaymentMode | undefined>(
    paymentOptions.includes('pay_at_convention') ? undefined : PaymentMode.Now,
  );
  const submitOrder = useSubmitOrder();
  const { myProfile } = useContext(AppRootContext);

  const [submitCheckOut, error, submitting] = useAsyncFunction(
    useCallback(async () => {
      const actualPaymentMode = totalPrice.fractional === 0 ? PaymentMode.Free : paymentMode;
      if (!actualPaymentMode) {
        throw new Error('Could not determine payment mode to use');
      }

      await submitOrder(order.id, actualPaymentMode);
      onComplete();
    }, [onComplete, paymentMode, submitOrder, order.id, totalPrice]),
    { suppressError: true },
  );

  const disabled = !paymentMode || submitting;

  const renderCheckOutModalContent = () => {
    if (totalPrice.fractional === 0) {
      return <div className="modal-body">{t('store.checkout.freeOrder')}</div>;
    }

    let paymentModeSelect = null;

    if (paymentOptions.includes('pay_at_convention')) {
      paymentModeSelect = (
        <MultipleChoiceInput
          name="paymentMode"
          caption={t('store.checkout.paymentModeSelect')}
          value={paymentMode}
          onChange={(newPaymentMode: string) => {
            setPaymentMode(newPaymentMode as PaymentMode);
          }}
          choices={[
            { value: PaymentMode.PaymentIntent, label: t('store.paymentMode.now') },
            { value: PaymentMode.Later, label: t('store.paymentMode.later') },
          ]}
        />
      );
    }

    return (
      <div className="modal-body">
        {paymentModeSelect}
        {paymentMode === PaymentMode.Now || PaymentMode.PaymentIntent ? (
          <>
            <LinkAuthenticationElement
              options={myProfile?.email ? { defaultValues: { email: myProfile.email } } : {}}
            />
            <PaymentElement />
          </>
        ) : null}
        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>
    );
  };

  return (
    <>
      <div className="modal-header lead">{t('store.checkout.title')}</div>
      {renderCheckOutModalContent()}
      <div className="modal-footer">
        <div className="d-flex align-items-center">
          <div className="col">
            {paymentMode === 'now' && totalPrice.fractional !== 0 ? (
              <img src={PoweredByStripeLogo} alt={t('store.checkout.poweredByStripe')} className="me-4" />
            ) : null}
          </div>
          <button type="button" className="btn btn-secondary me-2" onClick={onCancel} disabled={submitting}>
            {t('buttons.cancel')}
          </button>
          <button type="button" className="btn btn-primary" onClick={submitCheckOut} disabled={disabled}>
            {totalPrice.fractional === 0
              ? t('store.checkout.submitFree')
              : t('store.checkout.submitPaid', { price: formatMoney(totalPrice) })}
          </button>
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
  const { data, error } = useSuspenseQuery(CurrentPendingOrderPaymentIntentClientSecretQueryDocument);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <Modal visible={visible && order != null} dialogClassName="modal-lg">
      {visible && order != null && (
        <LazyStripeElementsContainer
          options={{ clientSecret: data.convention.my_profile?.current_pending_order?.payment_intent_client_secret }}
        >
          <OrderPaymentModalContents onCancel={onCancel} onComplete={onComplete} order={order} />
        </LazyStripeElementsContainer>
      )}
    </Modal>
  );
}

export default OrderPaymentModal;
