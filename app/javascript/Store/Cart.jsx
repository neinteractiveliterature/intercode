import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { flowRight } from 'lodash';
import gql from 'graphql-tag';
import { ConfirmModal } from 'react-bootstrap4-modal';
import ErrorDisplay from '../ErrorDisplay';
import formatMoney from '../formatMoney';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import OrderPaymentModal from './OrderPaymentModal';

const orderEntryFragment = gql`
fragment OrderEntryFields on OrderEntry {
  id
  quantity

  product {
    name
  }

  product_variant {
    name
  }

  price {
    fractional
    currency_code
  }

  price_per_item {
    fractional
    currency_code
  }
}
`;

const cartQuery = gql`
query {
  myProfile {
    name_without_nickname
  }

  currentPendingOrder {
    id

    order_entries {
      ...OrderEntryFields
    }
  }
}

${orderEntryFragment}
`;

const updateOrderEntryMutation = gql`
mutation($input: UpdateOrderEntryInput!) {
  updateOrderEntry(input: $input) {
    order_entry {
      ...OrderEntryFields
    }
  }
}

${orderEntryFragment}
`;

const deleteOrderEntryMutation = gql`
mutation($input: DeleteOrderEntryInput!) {
  deleteOrderEntry(input: $input) {
    order_entry {
      id
    }
  }
}
`;

@flowRight([
  graphql(cartQuery),
  graphql(updateOrderEntryMutation, {
    props: ({ mutate }) => ({
      updateOrderEntry: (id, quantity) => mutate({
        variables: { input: { id, order_entry: { quantity } } },
      }),
    }),
  }),
  graphql(deleteOrderEntryMutation, {
    props: ({ mutate }) => ({
      deleteOrderEntry: id => mutate({
        variables: { input: { id } },
        update: (proxy) => {
          const data = proxy.readQuery({ query: cartQuery });
          data.currentPendingOrder.order_entries = data.currentPendingOrder.order_entries
            .filter(entry => entry.id !== id);
          proxy.writeQuery({ query: cartQuery, data });
        },
      }),
    }),
  }),
])
@GraphQLQueryResultWrapper
class Cart extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(cartQuery).isRequired,
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

    let { name } = orderEntry.product;
    if (orderEntry.product_variant) {
      name += ` (${orderEntry.product_variant.name})`;
    }

    return `Are you sure you want to remove ${name} from your cart?`;
  }

  renderOrderEntriesTable = () => {
    if (
      !this.props.data.currentPendingOrder ||
      this.props.data.currentPendingOrder.order_entries.length === 0
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
              <strong>{formatMoney(totalPrice)}</strong>
              <br />
              <button className="btn btn-primary mt-2" onClick={this.checkOutClicked}>
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

      <OrderPaymentModal
        visible={this.state.checkingOut}
        onCancel={this.checkOutCanceled}
        initialName={this.props.data.myProfile.name_without_nickname}
        orderId={(this.props.data.currentPendingOrder || {}).id}
        onComplete={this.checkOutComplete}
        allowPayLater
      />

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
