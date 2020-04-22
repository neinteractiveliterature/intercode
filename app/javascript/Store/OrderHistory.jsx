import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import intersection from 'lodash/intersection';
import { useQuery } from '@apollo/react-hooks';

import { OrderHistoryQuery } from './queries.gql';
import OrderPaymentModal from './OrderPaymentModal';
import formatMoney from '../formatMoney';
import ErrorDisplay from '../ErrorDisplay';
import useModal from '../ModalDialogs/useModal';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function OrderHistoryOrderEntry({ orderEntry }) {
  const productVariant = orderEntry.product_variant || {};
  const name = orderEntry.product.name + (
    productVariant.name ? ` (${productVariant.name})` : ''
  );
  const imageUrl = productVariant.image_url || orderEntry.product.image_url;

  return (
    <tr>
      <td className="pl-4">
        <div className="d-flex">
          <div className="flex-grow-1">
            <strong>{name}</strong>
          </div>
          {imageUrl && <img className="mr-4" src={imageUrl} alt={name} style={{ width: '100px' }} />}
        </div>
      </td>
      <td className="text-right">{orderEntry.quantity}</td>
      <td className="text-right pr-4">{formatMoney(orderEntry.price)}</td>
    </tr>
  );
}

OrderHistoryOrderEntry.propTypes = {
  orderEntry: PropTypes.shape({
    product: PropTypes.shape({
      name: PropTypes.string.isRequired,
      image_url: PropTypes.string,
    }).isRequired,
    product_variant: PropTypes.shape({
      name: PropTypes.string,
      image_url: PropTypes.string,
    }),
    quantity: PropTypes.number.isRequired,
    price: PropTypes.shape({}).isRequired,
  }).isRequired,
};

function OrderHistoryCouponApplication({ couponApplication }) {
  return (
    <tr className="bg-light">
      <td colSpan={2} className="pl-4">
        <em>{'Coupon code: '}</em>
        <code>{couponApplication.coupon.code}</code>
      </td>
      <td className="pr-4 font-italic text-right">
        -
        {formatMoney(couponApplication.discount)}
      </td>
    </tr>
  );
}

OrderHistoryCouponApplication.propTypes = {
  couponApplication: PropTypes.shape({
    coupon: PropTypes.shape({
      code: PropTypes.string.isRequired,
    }).isRequired,
    discount: PropTypes.shape({}).isRequired,
  }).isRequired,
};

function OrderHistoryOrderStatus({ order, convention, paymentModal }) {
  if (order.status === 'paid') {
    const opsPosition = convention.staff_positions
      .find((staffPosition) => staffPosition.name === 'Operations Coordinator');
    const opsEmail = (opsPosition || {}).email;
    const emailSubject = `[${convention.name}] Cancellation request: order ${order.id}`;
    const emailBody = `I would like to request that order ${order.id} be canceled.`;

    return [
      <div key="status">
        <div className="badge badge-success">
          <div className="lead">Paid</div>
        </div>
      </div>,
      opsEmail ? (
        <a href={`mailto:${opsEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`} key="cancellation-link">
          <small>Request cancellation</small>
        </a>
      ) : null,
    ];
  }

  if (order.status === 'cancelled') {
    return (
      <div key="status">
        <div className="badge badge-danger">
          <div className="lead">Canceled</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="badge badge-warning">
          <div className="lead">Pay at convention</div>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-sm btn-outline-success mt-2"
        onClick={() => { paymentModal.open({ order }); }}
      >
        Pay now
      </button>
    </>
  );
}

OrderHistoryOrderStatus.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  convention: PropTypes.shape({
    name: PropTypes.string.isRequired,
    staff_positions: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
    })).isRequired,
  }).isRequired,
  paymentModal: PropTypes.shape({
    open: PropTypes.func.isRequired,
  }).isRequired,
};

function OrderHistoryOrder({ order, convention, paymentModal }) {
  const submittedTime = moment(order.submitted_at).tz(convention.timezone_name);

  return (
    <li key={order.id} className="card mb-4">
      <div className="d-flex card-header border-bottom-0">
        <div className="col pl-0">
          <h3>
            Order #
            {order.id}
          </h3>
          <small>{submittedTime.format('dddd, MMMM D, YYYY, h:mma')}</small>
        </div>
        <div className="text-right">
          <OrderHistoryOrderStatus
            order={order}
            convention={convention}
            paymentModal={paymentModal}
          />
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
              <td colSpan={3} className="text-right px-4">
                <strong>
                  Total:
                  {' '}
                  {formatMoney(order.total_price)}
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </li>
  );
}

OrderHistoryOrder.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    submitted_at: PropTypes.string.isRequired,
    total_price: PropTypes.shape({}).isRequired,
    order_entries: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
    coupon_applications: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
  convention: PropTypes.shape({
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
  paymentModal: PropTypes.shape({}).isRequired,
};

function OrderHistory() {
  const { data, loading, error } = useQuery(OrderHistoryQuery);
  const paymentModal = useModal();

  usePageTitle('My order history');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { orders } = data.myProfile;

  if (orders?.length > 0) {
    return (
      <>
        <h1 className="mb-4">My order history</h1>
        <ul className="list-unstyled">
          {orders.map((order) => (
            <OrderHistoryOrder
              key={order.id}
              convention={data.convention}
              order={order}
              paymentModal={paymentModal}
            />
          ))}

          <OrderPaymentModal
            visible={paymentModal.visible}
            onCancel={paymentModal.close}
            initialName={data.myProfile.name_without_nickname}
            orderId={paymentModal.state?.order?.id ?? 0}
            onComplete={paymentModal.close}
            paymentOptions={
              paymentModal.state
                ? intersection(
                  ...paymentModal.state.order.order_entries
                    .map((entry) => entry.product.payment_options),
                ).filter((paymentOption) => paymentOption !== 'pay_at_convention')
                : []
            }
            totalPrice={paymentModal.state?.order?.total_price ?? { fractional: 0 }}
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
}

export default OrderHistory;
