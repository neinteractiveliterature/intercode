import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { humanize } from 'inflected';
import moment from 'moment-timezone';
import { useMutation } from '@apollo/react-hooks';

import formatMoney from '../formatMoney';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import { MarkOrderPaid, AdminUpdateOrder, CancelOrder } from './mutations.gql';
import { useConfirm } from '../ModalDialogs/Confirm';
import AppRootContext from '../AppRootContext';
import ErrorDisplay from '../ErrorDisplay';

function AdminOrderModal({ order, closeModal }) {
  const { timezoneName } = useContext(AppRootContext);
  const confirm = useConfirm();
  const [markOrderPaid] = useMutation(MarkOrderPaid);
  const [updateOrder] = useMutation(AdminUpdateOrder);
  const [cancelOrder] = useMutation(CancelOrder);

  const renderCancelButton = () => {
    let prompt;
    let buttonCaption;

    if (order.charge_id) {
      prompt = (
        <div>
          <p>
            Are you sure you want to cancel order #
            {order.id}
            ?
          </p>
          <p>
            This will issue a refund back to
            {' '}
            {order.user_con_profile.name_without_nickname}
            &apos;s payment card.
          </p>
        </div>
      );
      buttonCaption = 'Cancel and refund';
    } else if (order.status === 'paid') {
      prompt = (
        <div>
          <p>
            Are you sure you want to cancel order #
            {order.id}
            ?
          </p>
          <p>
            Because there is
            no Stripe charge associated with this order,
            {' '}
            {order.user_con_profile.name_without_nickname}
            {' '}
            will not automatically
            receive a refund, so they will have to be refunded manually.
          </p>
        </div>
      );
      buttonCaption = 'Cancel without refund';
    } else {
      prompt = (
        <div>
          <p>
            Are you sure you want to cancel order #
            {order.id}
            ?
          </p>
        </div>
      );
      buttonCaption = 'Cancel';
    }

    return (
      <button
        type="button"
        className="btn btn-sm btn-outline-danger"
        onClick={() => confirm({
          prompt,
          action: () => cancelOrder({ variables: { orderId: order.id } }),
          renderError: (error) => <ErrorDisplay graphQLError={error} />,
        })}
      >
        {buttonCaption}
      </button>
    );
  };

  const renderOrderActions = () => {
    if (order.status === 'unpaid') {
      return (
        <div>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger mr-1"
            onClick={() => confirm({
              prompt: `Are you sure you want to mark order #${order.id} as paid?`,
              action: () => markOrderPaid({ variables: { orderId: order.id } }),
              renderError: (error) => <ErrorDisplay graphQLError={error} />,
            })}
          >
            Mark as paid
          </button>
          {renderCancelButton()}
        </div>
      );
    }

    if (order.status === 'paid') {
      return renderCancelButton();
    }

    return null;
  };

  const renderBody = () => {
    if (order == null) {
      return null;
    }

    const items = order.order_entries.map((orderEntry) => (
      <li key={orderEntry.id}>
        {orderEntry.describe_products}
      </li>
    ));

    return (
      <div>
        <dl className="row m-0">
          <dt className="col-md-3">Customer name</dt>
          <dd className="col-md-9">{order.user_con_profile.name_without_nickname}</dd>

          <dt className="col-md-3">Products</dt>
          <dd className="col-md-9">
            <ul className="list-unstyled m-0">{items}</ul>
          </dd>

          <dt className="col-md-3">Total price</dt>
          <dd className="col-md-9">{formatMoney(order.total_price)}</dd>

          <dt className="col-md-3">Order status</dt>
          <dd className="col-md-9">
            <ul className="list-inline m-0">
              <li className="list-inline-item">
                {humanize(order.status)}
                {(
                  order.paid_at
                    ? `on ${moment(order.paid_at).tz(timezoneName).format('ddd, MMM D, YYYY {at} h:mma')}`
                    : null
                )}
              </li>
              <li className="list-inline-item">{renderOrderActions()}</li>
            </ul>
          </dd>

          <dt className="col-md-3">Payment note</dt>
          <dd className="col-md-9">
            <InPlaceEditor
              value={order.payment_note || ''}
              renderInput={({ onChange, ...inputProps }) => (
                <textarea
                  className="form-control col mr-1"
                  onChange={(event) => { onChange(event.target.value); }}
                  {...inputProps}
                />
              )}
              onChange={(value) => updateOrder({
                variables: {
                  orderId: order.id,
                  paymentNote: value,
                },
              })}
            />
          </dd>
        </dl>
      </div>
    );
  };

  return (
    <Modal
      visible={order != null && !confirm.visible}
      dialogClassName="modal-lg"
    >
      <div className="modal-header">
        Order #
        {(order || {}).id}
      </div>
      <div className="modal-body">
        {renderBody()}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={closeModal}>Close</button>
      </div>
    </Modal>
  );
}

AdminOrderModal.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    charge_id: PropTypes.string,
    user_con_profile: PropTypes.shape({
      name_without_nickname: PropTypes.string.isRequired,
    }).isRequired,
    order_entries: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
    total_price: PropTypes.shape({}),
    paid_at: PropTypes.string,
    payment_note: PropTypes.string,
  }),
  closeModal: PropTypes.func.isRequired,
};

AdminOrderModal.defaultProps = {
  order: null,
};

export default AdminOrderModal;
