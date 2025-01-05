import { useContext, useState } from 'react';
import { DateTime } from 'luxon';
import { ErrorDisplay, useModal } from '@neinteractiveliterature/litform';
import type { ModalData } from '@neinteractiveliterature/litform/dist/types/useModal';

import OrderPaymentModal from './OrderPaymentModal';
import formatMoney from '../formatMoney';
import usePageTitle from '../usePageTitle';
import AppRootContext from '../AppRootContext';
import { OrderHistoryQueryData, OrderHistoryQueryDocument } from './queries.generated';
import useLoginRequired from '../Authentication/useLoginRequired';
import { useAppDateTimeFormat } from '../TimeUtils';
import { useTranslation } from 'react-i18next';
import { LoaderFunction, useLoaderData } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { ApolloError } from '@apollo/client';

type OrderType = NonNullable<OrderHistoryQueryData['convention']['my_profile']>['orders'][0];
type PaymentModalState = {
  order: OrderType;
};

type OrderHistoryOrderEntryProps = {
  orderEntry: OrderType['order_entries'][0];
};

function OrderHistoryOrderEntry({ orderEntry }: OrderHistoryOrderEntryProps) {
  const productVariant = orderEntry.product_variant;
  const name = orderEntry.product.name + (productVariant?.name ? ` (${productVariant.name})` : '');
  const imageUrl = productVariant?.image?.url ?? orderEntry.product.image?.url;

  return (
    <tr>
      <td className="ps-4">
        <div className="d-flex">
          <div className="flex-grow-1">
            <strong>{name}</strong>
          </div>
          {imageUrl && <img className="me-4" src={imageUrl} alt={name} style={{ width: '100px' }} />}
        </div>
      </td>
      <td className="text-end">{orderEntry.quantity}</td>
      <td className="text-end pe-4">{formatMoney(orderEntry.price)}</td>
    </tr>
  );
}

type OrderHistoryCouponApplicationProps = {
  couponApplication: OrderType['coupon_applications'][0];
};

function OrderHistoryCouponApplication({ couponApplication }: OrderHistoryCouponApplicationProps) {
  const { t } = useTranslation();

  return (
    <tr className="bg-light">
      <td colSpan={2} className="ps-4">
        <em>{t('store.orderHistory.couponCodeLabel')}</em>
        <code>{couponApplication.coupon.code}</code>
      </td>
      <td className="pe-4 font-italic text-end">
        {formatMoney({ ...couponApplication.discount, fractional: couponApplication.discount.fractional * -1 })}
      </td>
    </tr>
  );
}

type OrderHistoryOrderStatusProps = {
  order: OrderType;
  convention: OrderHistoryQueryData['convention'];
  paymentModal: ModalData<PaymentModalState>;
};

function OrderHistoryOrderStatus({ order, convention, paymentModal }: OrderHistoryOrderStatusProps) {
  const { t } = useTranslation();
  if (order.status === 'paid') {
    const opsPosition = convention.staff_positions.find(
      (staffPosition) => staffPosition.name === 'Operations Coordinator',
    );
    const opsEmail = (opsPosition || {}).email;
    const emailSubject = t('store.orderHistory.cancellationRequestSubject', {
      conventionName: convention.name,
      orderId: order.id,
    });
    const emailBody = t('store.orderHistory.cancellationRequestBody', { orderId: order.id });

    return (
      <>
        <div>
          <div className="badge bg-success">
            <div className="lead">{t('store.orderStatus.paid')}</div>
          </div>
        </div>
        {opsEmail && (
          <a
            href={`mailto:${opsEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
              emailBody,
            )}`}
          >
            <small>{t('store.orderHistory.requestCancellation')}</small>
          </a>
        )}
      </>
    );
  }

  if (order.status === 'cancelled') {
    return (
      <div key="status">
        <div className="badge bg-danger">
          <div className="lead">{t('store.orderStatus.cancelled')}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="badge bg-warning">
          <div className="lead">{t('store.paymentMode.later')}</div>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-sm btn-outline-success mt-2"
        onClick={() => {
          paymentModal.open({ order });
        }}
      >
        {t('store.paymentMode.now')}
      </button>
    </>
  );
}

type OrderHistoryOrderProps = {
  order: OrderType;
  convention: OrderHistoryQueryData['convention'];
  paymentModal: ModalData<PaymentModalState>;
};

function OrderHistoryOrder({ order, convention, paymentModal }: OrderHistoryOrderProps) {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();
  const submittedTime = order.submitted_at ? DateTime.fromISO(order.submitted_at, { zone: timezoneName }) : undefined;

  return (
    <li key={order.id} className="card mb-4">
      <div className="d-flex card-header border-bottom-0">
        <div className="col ps-0">
          <h3>{t('store.orderHistory.orderHeader', { orderId: order.id })}</h3>
          <small>{submittedTime && format(submittedTime, 'longWeekdayDateTimeWithZone')}</small>
        </div>
        <div className="text-end">
          <OrderHistoryOrderStatus order={order} convention={convention} paymentModal={paymentModal} />
        </div>
      </div>
      <div className="card-body p-0">
        <table className="table m-0">
          <tbody>
            {order.order_entries.map((entry) => (
              <OrderHistoryOrderEntry key={entry.id} orderEntry={entry} />
            ))}
            {order.coupon_applications.map((app) => (
              <OrderHistoryCouponApplication key={app.id} couponApplication={app} />
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-warning-light">
              <td colSpan={3} className="text-end px-4">
                <strong>{t('store.totalPrice', { totalPrice: order.total_price })}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </li>
  );
}

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<OrderHistoryQueryData>({ query: OrderHistoryQueryDocument });
  return data;
};

function OrderHistory() {
  const data = useLoaderData() as OrderHistoryQueryData;
  const paymentModal = useModal<PaymentModalState>();
  const [error, setError] = useState<Error>();

  usePageTitle('My order history');
  useLoginRequired();

  const orders = data.convention.my_profile?.orders;

  if (orders && orders?.length > 0) {
    return (
      <>
        <h1 className="mb-4">My order history</h1>
        <ul className="list-unstyled">
          {orders.map((order) => (
            <OrderHistoryOrder key={order.id} convention={data.convention} order={order} paymentModal={paymentModal} />
          ))}

          {paymentModal.visible && (
            <OrderPaymentModal
              visible
              onCancel={paymentModal.close}
              order={paymentModal.state?.order}
              onComplete={paymentModal.close}
              onError={(error) => {
                setError(error);
                paymentModal.close();
              }}
            />
          )}
        </ul>

        <ErrorDisplay graphQLError={error as ApolloError} />
      </>
    );
  }

  return (
    <>
      <h1 className="mb-4">My order history</h1>
      <p>No orders to display.</p>
    </>
  );
}

export const Component = OrderHistory;
