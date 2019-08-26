import React from 'react';
import PropTypes from 'prop-types';
import Modal, { ConfirmModal } from 'react-bootstrap4-modal';
import { Mutation } from 'react-apollo';
import { humanize } from 'inflected';
import moment from 'moment-timezone';

import formatMoney from '../formatMoney';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import { MarkOrderPaid, AdminUpdateOrder, CancelOrder } from './mutations.gql';

class AdminOrderModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirm: null,
    };
  }

  beginConfirm = (prompt, action) => {
    this.setState({
      confirm: { prompt, action },
    });
  }

  performConfirm = async () => {
    await this.state.confirm.action();
    this.setState({ confirm: null });
  }

  cancelConfirm = () => {
    this.setState({ confirm: null });
  }

  renderCancelButton = () => {
    let prompt;
    let buttonCaption;

    if (this.props.order.charge_id) {
      prompt = (
        <div>
          <p>
            Are you sure you want to cancel order #
            {this.props.order.id}
            ?
          </p>
          <p>
            This will issue a refund back to
            {' '}
            {this.props.order.user_con_profile.name_without_nickname}
            &apos;s payment card.
          </p>
        </div>
      );
      buttonCaption = 'Cancel and refund';
    } else if (this.props.order.status === 'paid') {
      prompt = (
        <div>
          <p>
            Are you sure you want to cancel order #
            {this.props.order.id}
            ?
          </p>
          <p>
            Because there is
            no Stripe charge associated with this order,
            {' '}
            {this.props.order.user_con_profile.name_without_nickname}
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
            {this.props.order.id}
            ?
          </p>
        </div>
      );
      buttonCaption = 'Cancel';
    }

    return (
      <Mutation mutation={CancelOrder}>
        {(cancelOrder) => (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => {
              this.beginConfirm(
                prompt,
                () => cancelOrder({ variables: { orderId: this.props.order.id } }),
              );
            }}
          >
            {buttonCaption}
          </button>
        )}
      </Mutation>
    );
  }

  renderOrderActions = () => {
    if (this.props.order.status === 'unpaid') {
      return (
        <div>
          <Mutation mutation={MarkOrderPaid}>
            {(markOrderPaid) => (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger mr-1"
                onClick={() => {
                  this.beginConfirm(
                    `Are you sure you want to mark order #${this.props.order.id} as paid?`,
                    () => markOrderPaid({ variables: { orderId: this.props.order.id } }),
                  );
                }}
              >
                Mark as paid
              </button>
            )}
          </Mutation>
          {this.renderCancelButton()}
        </div>
      );
    }

    if (this.props.order.status === 'paid') {
      return this.renderCancelButton();
    }

    return null;
  }

  renderBody = () => {
    const { order } = this.props;

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
                    ? `on ${moment(order.paid_at).tz(this.props.timezoneName).format('ddd, MMM D, YYYY {at} h:mma')}`
                    : null
                )}
              </li>
              <li className="list-inline-item">{this.renderOrderActions()}</li>
            </ul>
          </dd>

          <dt className="col-md-3">Payment note</dt>
          <dd className="col-md-9">
            <Mutation mutation={AdminUpdateOrder}>
              {(updateOrder) => (
                <InPlaceEditor
                  value={order.payment_note}
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
              )}
            </Mutation>
          </dd>
        </dl>
      </div>
    );
  }

  render = () => (
    <div>
      <Modal
        visible={this.props.order != null && this.state.confirm == null}
        dialogClassName="modal-lg"
      >
        <div className="modal-header">
          Order #
          {(this.props.order || {}).id}
        </div>
        <div className="modal-body">
          {this.renderBody()}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={this.props.closeModal}>Close</button>
        </div>
      </Modal>

      <ConfirmModal
        visible={this.state.confirm != null}
        onOK={this.performConfirm}
        onCancel={this.cancelConfirm}
      >
        {(this.state.confirm || { prompt: '' }).prompt}
      </ConfirmModal>
    </div>
  )
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
    total_price: PropTypes.number,
    paid_at: PropTypes.string,
    payment_note: PropTypes.string,
  }),
  closeModal: PropTypes.func.isRequired,
  timezoneName: PropTypes.string.isRequired,
};

AdminOrderModal.defaultProps = {
  order: null,
};

export default AdminOrderModal;
