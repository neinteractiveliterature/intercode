import { useContext } from 'react';
import { DateTime } from 'luxon';
import { useModal, LoadQueryWrapper } from '@neinteractiveliterature/litform';
import { ModalData } from '@neinteractiveliterature/litform/lib/useModal';

import OrderPaymentModal from './OrderPaymentModal';
import formatMoney from '../formatMoney';
import usePageTitle from '../usePageTitle';
import AppRootContext from '../AppRootContext';
import { OrderHistoryQueryData, useOrderHistoryQuery } from './queries.generated';
import useLoginRequired from '../Authentication/useLoginRequired';
import { useAppDateTimeFormat } from '../TimeUtils';

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
  return (
    <tr className="bg-light">
      <td colSpan={2} className="ps-4">
        <em>{'Coupon code: '}</em>
        <code>{couponApplication.coupon.code}</code>
      </td>
      <td className="pe-4 font-italic text-end">-{formatMoney(couponApplication.discount)}</td>
    </tr>
  );
}

type OrderHistoryOrderStatusProps = {
  order: OrderType;
  convention: OrderHistoryQueryData['convention'];
  paymentModal: ModalData<PaymentModalState>;
};

function OrderHistoryOrderStatus({ order, convention, paymentModal }: OrderHistoryOrderStatusProps) {
  if (order.status === 'paid') {
    const opsPosition = convention.staff_positions.find(
      (staffPosition) => staffPosition.name === 'Operations Coordinator',
    );
    const opsEmail = (opsPosition || {}).email;
    const emailSubject = `[${convention.name}] Cancellation request: order ${order.id}`;
    const emailBody = `I would like to request that order ${order.id} be canceled.`;

    return (
      <>
        <div>
          <div className="badge bg-success">
            <div className="lead">Paid</div>
          </div>
        </div>
        {opsEmail && (
          <a
            href={`mailto:${opsEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
              emailBody,
            )}`}
          >
            <small>Request cancellation</small>
          </a>
        )}
      </>
    );
  }

  if (order.status === 'cancelled') {
    return (
      <div key="status">
        <div className="badge bg-danger">
          <div className="lead">Canceled</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="badge bg-warning">
          <div className="lead">Pay at convention</div>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-sm btn-outline-success mt-2"
        onClick={() => {
          paymentModal.open({ order });
        }}
      >
        Pay now
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
  const { timezoneName } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();
  const submittedTime = order.submitted_at ? DateTime.fromISO(order.submitted_at, { zone: timezoneName }) : undefined;

  return (
    <li key={order.id} className="card mb-4">
      <div className="d-flex card-header border-bottom-0">
        <div className="col ps-0">
          <h3>Order #{order.id}</h3>
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
                <strong>Total: {formatMoney(order.total_price)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </li>
  );
}

export default LoadQueryWrapper(useOrderHistoryQuery, function OrderHistory({ data }) {
  const paymentModal = useModal<PaymentModalState>();

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

          <OrderPaymentModal
            visible={paymentModal.visible}
            onCancel={paymentModal.close}
            order={paymentModal.state?.order}
            onComplete={paymentModal.close}
          />
        </ul>
      </>
    );
  }

  return (
    <>
      <h1 className="mb-4">My order history</h1>
      <p>No orders to display.</p>
    </>
  );
});
