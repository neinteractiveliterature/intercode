import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { humanize } from 'inflected';
import moment from 'moment-timezone';
import { useMutation } from '@apollo/react-hooks';
import classNames from 'classnames';

import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import { MarkOrderPaid, AdminUpdateOrder, CancelOrder } from './mutations.gql';
import { useConfirm } from '../ModalDialogs/Confirm';
import AppRootContext from '../AppRootContext';
import ErrorDisplay from '../ErrorDisplay';
import AdminOrderEntriesTable from './AdminOrderEntriesTable';
import InPlaceMoneyEditor from './InPlaceMoneyEditor';

function CancelOrderButton({ order, skipRefund }) {
  const [cancelOrder] = useMutation(CancelOrder);
  const confirm = useConfirm();
  let prompt;
  let buttonCaption;

  if (order.charge_id && !skipRefund) {
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
        {order.charge_id
          ? (
            <div className="alert alert-danger mb-0">
              This will not issue a refund.  Please make sure this is what you want to do.  If you
              would rather issue a refund, cancel this and select “Cancel and refund” instead.
            </div>
          )
          : (
            <div className="alert alert-warning mb-0">
              Because there is
              no Stripe charge associated with this order,
              {' '}
              {order.user_con_profile.name_without_nickname}
              {' '}
              will not automatically
              receive a refund, so they will have to be refunded manually.
            </div>
          )}
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
      className={classNames(
        'btn btn-sm mr-1',
        skipRefund ? 'btn-danger' : 'btn-warning',
      )}
      onClick={() => confirm({
        prompt,
        action: () => cancelOrder({ variables: { orderId: order.id, skipRefund } }),
        renderError: (error) => <ErrorDisplay graphQLError={error} />,
      })}
    >
      {buttonCaption}
    </button>
  );
}

CancelOrderButton.propTypes = {
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
  }).isRequired,
  skipRefund: PropTypes.bool.isRequired,
};

function OrderActions({ order }) {
  const confirm = useConfirm();
  const [markOrderPaid] = useMutation(MarkOrderPaid);

  const buttons = [];

  if (order.status === 'unpaid') {
    buttons.push(
      <button
        type="button"
        className="btn btn-sm btn-outline-danger mr-1"
        onClick={() => confirm({
          prompt: `Are you sure you want to mark order #${order.id} as paid?`,
          action: () => markOrderPaid({ variables: { orderId: order.id } }),
          renderError: (error) => <ErrorDisplay graphQLError={error} />,
        })}
        key="markAsPaid"
      >
        Mark as paid
      </button>,
    );
  }

  if (order.status === 'unpaid' || order.status === 'paid') {
    buttons.push(<CancelOrderButton order={order} key="cancel" />);

    if (order.charge_id) {
      buttons.push(<CancelOrderButton order={order} skipRefund key="cancelWithoutRefund" />);
    }
  }

  return buttons;
}

function AdminOrderModal({ order, closeModal }) {
  const { timezoneName } = useContext(AppRootContext);
  const confirm = useConfirm();
  const [updateOrder] = useMutation(AdminUpdateOrder);

  const renderBody = () => {
    if (order == null) {
      return null;
    }

    return (
      <div>
        <dl className="row m-0">
          <dt className="col-md-3">Customer name</dt>
          <dd className="col-md-9">{order.user_con_profile.name_without_nickname}</dd>

          <dt className="col-md-3">Payment amount</dt>
          <dd className="col-md-9">
            <InPlaceMoneyEditor
              value={order.payment_amount}
              onChange={(value) => updateOrder({
                variables: {
                  id: order.id,
                  order: {
                    payment_amount: {
                      fractional: value.fractional,
                      currency_code: value.currency_code,
                    },
                  },
                },
              })}
            />
          </dd>

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
              <li className="list-inline-item">
                <OrderActions order={order} />
              </li>
            </ul>
          </dd>

          <dt className="col-md-3">Payment note</dt>
          <dd className="col-md-9">
            <InPlaceEditor
              value={order.payment_note || ''}
              renderInput={({ buttons, inputProps: { onChange, ...inputProps } }) => (
                <>
                  <textarea
                    className="form-control col mr-1"
                    onChange={(event) => { onChange(event.target.value); }}
                    {...inputProps}
                  />
                  {buttons}
                </>
              )}
              onChange={(value) => updateOrder({
                variables: {
                  id: order.id,
                  order: {
                    payment_note: value,
                  },
                },
              })}
            />
          </dd>
        </dl>

        <section className="mt-4">
          <AdminOrderEntriesTable order={order} />
        </section>
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
    payment_amount: PropTypes.shape({}),
    paid_at: PropTypes.string,
    payment_note: PropTypes.string,
  }),
  closeModal: PropTypes.func.isRequired,
};

AdminOrderModal.defaultProps = {
  order: null,
};

export default AdminOrderModal;
