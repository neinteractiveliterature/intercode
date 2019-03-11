import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { flowRight, intersection } from 'lodash';
import { ConfirmModal } from 'react-bootstrap4-modal';
import { Elements } from 'react-stripe-elements';

import { CartQuery } from './queries.gql';
import { DeleteOrderEntry, UpdateOrderEntry } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import formatMoney from '../formatMoney';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import LazyStripe from '../LazyStripe';
import OrderPaymentModal from './OrderPaymentModal';

@flowRight([
  graphql(CartQuery),
  graphql(UpdateOrderEntry, {
    props: ({ mutate }) => ({
      updateOrderEntry: (id, quantity) => mutate({
        variables: { input: { id, order_entry: { quantity } } },
      }),
    }),
  }),
  graphql(DeleteOrderEntry, {
    props: ({ mutate }) => ({
      deleteOrderEntry: id => mutate({
        variables: { input: { id } },
        update: (proxy) => {
          const data = proxy.readQuery({ query: CartQuery });
          data.currentPendingOrder.order_entries = data.currentPendingOrder.order_entries
            .filter(entry => entry.id !== id);
          proxy.writeQuery({ query: CartQuery, data });
        },
      }),
    }),
  }),
])
@GraphQLQueryResultWrapper
class Cart extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(CartQuery).isRequired,
    afterCompleteUrl: PropTypes.string.isRequired,
    updateOrderEntry: PropTypes.func.isRequired,
    deleteOrderEntry: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      checkingOut: false,
      confirmingDeleteOrderEntryId: null,
    };
  }

  changeQuantity = async (orderEntryId, newQuantityString) => {
    const newQuantity = Number.parseInt(newQuantityString, 10);
    if (Number.isNaN(newQuantity)) {
      return;
    }

    try {
      if (newQuantity === 0) {
        await this.props.deleteOrderEntry(orderEntryId);
      } else {
        await this.props.updateOrderEntry(orderEntryId, newQuantity);
      }
    } catch (error) {
      this.setState({ error });
    }
  }

  deleteOrderEntryClicked = (confirmingDeleteOrderEntryId) => {
    this.setState({ confirmingDeleteOrderEntryId });
  }

  deleteOrderEntryConfirmed = async () => {
    try {
      await this.props.deleteOrderEntry(this.state.confirmingDeleteOrderEntryId);
      this.setState({ confirmingDeleteOrderEntryId: null });
    } catch (error) {
      this.setState({ error, confirmingDeleteOrderEntryId: null });
    }
  }

  deleteOrderEntryCanceled = async () => {
    this.setState({ confirmingDeleteOrderEntryId: null });
  }

  checkOutClicked = () => {
    this.setState({ checkingOut: true });
  }

  checkOutCanceled = () => {
    this.setState({ checkingOut: false });
  }

  checkOutComplete = () => {
    window.location.href = this.props.afterCompleteUrl;
  }

  renderConfirmDeleteModalContent = () => {
    if (this.state.confirmingDeleteOrderEntryId == null) {
      return '';
    }

    const orderEntry = this.props.data.currentPendingOrder.order_entries
      .find(entry => entry.id === this.state.confirmingDeleteOrderEntryId);

    if (!orderEntry) {
      return '';
    }

    let { name } = orderEntry.product;
    if (orderEntry.product_variant) {
      name += ` (${orderEntry.product_variant.name})`;
    }

    return `Are you sure you want to remove ${name} from your cart?`;
  }

  renderOrderEntriesTable = () => {
    if (
      !this.props.data.currentPendingOrder
      || this.props.data.currentPendingOrder.order_entries.length === 0
    ) {
      return 'Your cart is empty.';
    }

    const rows = this.props.data.currentPendingOrder.order_entries.map(entry => (
      <tr key={entry.id}>
        <td>
          {entry.product.name}
          {
            entry.product_variant ? ` (${entry.product_variant.name})` : null
          }
        </td>
        <td>
          <InPlaceEditor
            value={entry.quantity.toString()}
            onChange={(newValue) => { this.changeQuantity(entry.id, newValue); }}
          />
        </td>
        <td>{formatMoney(entry.price)}</td>
        <td>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => { this.deleteOrderEntryClicked(entry.id); }}
          >
            <i className="fa fa-trash-o" />
            <span className="sr-only">Remove from cart</span>
          </button>
        </td>
      </tr>
    ));

    const totalPrice = this.props.data.currentPendingOrder.order_entries
      .map(entry => entry.price.fractional)
      .reduce((total, entryPrice) => total + entryPrice, 0);

    const currencyCode = (
      this.props.data.currentPendingOrder.order_entries[0] || { currency_code: 'USD' }
    ).currency_code;

    return (
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
        <tfoot>
          <tr>
            <td colSpan="2">
              <strong>Total</strong>
            </td>
            <td colSpan="2">
              <strong>
                {formatMoney({ fractional: totalPrice, currency_code: currencyCode })}
              </strong>
              <br />
              <button type="button" className="btn btn-primary mt-2" onClick={this.checkOutClicked}>
                <i className="fa fa-shopping-cart" />
                {' '}
                Check out
              </button>
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    );
  }

  render = () => (
    <div>
      <ErrorDisplay graphQLError={this.state.error} />
      {this.renderOrderEntriesTable()}

      <LazyStripe>
        <Elements>
          <OrderPaymentModal
            visible={this.state.checkingOut}
            onCancel={this.checkOutCanceled}
            initialName={this.props.data.myProfile.name_without_nickname}
            orderId={(this.props.data.currentPendingOrder || {}).id}
            onComplete={this.checkOutComplete}
            paymentOptions={
              intersection(
                ...this.props.data.currentPendingOrder.order_entries
                  .map(entry => entry.product.payment_options),
              )
            }
          />
        </Elements>
      </LazyStripe>

      <ConfirmModal
        visible={this.state.confirmingDeleteOrderEntryId != null}
        onOK={this.deleteOrderEntryConfirmed}
        onCancel={this.deleteOrderEntryCanceled}
      >
        {this.renderConfirmDeleteModalContent()}
      </ConfirmModal>
    </div>
  )
}

export default Cart;
