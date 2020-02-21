import React from 'react';
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

  const renderOrderEntry = (orderEntry) => {
    const productVariant = orderEntry.product_variant || {};
    const name = orderEntry.product.name + (
      productVariant.name ? ` (${productVariant.name})` : ''
    );
    const imageUrl = productVariant.image_url || orderEntry.product.image_url;

    return (
      <div key={orderEntry.id}>
        <div className="media mt-2">
          {
            imageUrl
              ? (<img className="mr-4" src={imageUrl} alt={name} style={{ width: '100px' }} />)
              : <div style={{ width: '100px' }} />
          }
          <div className="media-body mt-2">
            <div className="row align-items-center">
              <div className="col-md-6"><strong>{name}</strong></div>
              <div className="col-md-3 text-right">{orderEntry.quantity}</div>
              <div className="col-md-3 text-right">{formatMoney(orderEntry.price)}</div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  };

  const renderOrderStatus = (order) => {
    if (order.status === 'paid') {
      const opsPosition = data.convention.staff_positions
        .find((staffPosition) => staffPosition.name === 'Operations Coordinator');
      const opsEmail = (opsPosition || {}).email;
      const emailSubject = `[${data.convention.name}] Cancellation request: order ${order.id}`;
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

    return [
      <div key="status">
        <div className="badge badge-warning">
          <div className="lead">Pay at convention</div>
        </div>
      </div>,
      <button
        type="button"
        className="btn btn-sm btn-outline-success mt-2"
        key="pay-now-button"
        onClick={() => { paymentModal.open({ order }); }}
      >
        Pay now
      </button>,
    ];
  };

  const renderOrder = (order) => {
    const renderedOrderEntries = order.order_entries.map((entry) => renderOrderEntry(entry));
    const submittedTime = moment(order.submitted_at).tz(data.convention.timezone_name);

    return (
      <li key={order.id} className="card mb-4">
        <div className="d-flex card-header">
          <div className="col">
            <h3>
              Order #
              {order.id}
            </h3>
            <small>{submittedTime.format('dddd, MMMM D, YYYY, h:mma')}</small>
          </div>
          <div className="text-right">
            {renderOrderStatus(order)}
          </div>
        </div>
        <div className="pl-4 card-body">
          {renderedOrderEntries}
          <div className="text-right">
            <strong>
              Total:
              {' '}
              {formatMoney(order.total_price)}
            </strong>
          </div>
        </div>
      </li>
    );
  };

  const { orders } = data.myProfile;

  if (orders.length > 0) {
    const renderedOrders = orders.map((order) => renderOrder(order));
    return (
      <>
        <h1 className="mb-4">My order history</h1>
        <ul className="list-unstyled">
          {renderedOrders}

          <OrderPaymentModal
            visible={paymentModal.visible}
            onCancel={paymentModal.close}
            initialName={data.myProfile.name_without_nickname}
            orderId={(paymentModal.state || { order: { id: 0 } }).order.id}
            onComplete={paymentModal.close}
            paymentOptions={
              paymentModal.state
                ? intersection(
                  ...paymentModal.state.order.order_entries
                    .map((entry) => entry.product.payment_options),
                ).filter((paymentOption) => paymentOption !== 'pay_at_convention')
                : []
            }
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
