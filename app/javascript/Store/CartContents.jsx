import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import { CartQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import formatMoney from '../formatMoney';

function CartContents({ removeFromCart, changeQuantity, checkOutButton }) {
  const { data, loading, error } = useQuery(CartQuery);

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  if (
    !data.currentPendingOrder
    || data.currentPendingOrder.order_entries.length === 0
  ) {
    return 'Your cart is empty.';
  }

  const rows = data.currentPendingOrder.order_entries.map((entry) => (
    <tr key={entry.id}>
      <td>
        {entry.product.name}
        {
          entry.product_variant ? ` (${entry.product_variant.name})` : null
        }
      </td>
      <td>
        {changeQuantity
          ? (
            <InPlaceEditor
              value={entry.quantity.toString()}
              onChange={(newValue) => { changeQuantity(entry, newValue); }}
            />
          )
          : entry.quantity}
      </td>
      <td>{formatMoney(entry.price)}</td>
      <td>
        {removeFromCart && (
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => { removeFromCart(entry); }}
          >
            <i className="fa fa-trash-o" />
            <span className="sr-only">Remove from cart</span>
          </button>
        )}
      </td>
    </tr>
  ));

  const totalPrice = data.currentPendingOrder.order_entries
    .map((entry) => entry.price.fractional)
    .reduce((total, entryPrice) => total + entryPrice, 0);

  const currencyCode = (
    data.currentPendingOrder.order_entries[0] || { currency_code: 'USD' }
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
            {checkOutButton && (
              <>
                <br />
                {checkOutButton}
              </>
            )}
          </td>
          <td />
        </tr>
      </tfoot>
    </table>
  );
}

CartContents.propTypes = {
  removeFromCart: PropTypes.func,
  changeQuantity: PropTypes.func,
  checkOutButton: PropTypes.node,
};

CartContents.defaultProps = {
  removeFromCart: null,
  changeQuantity: null,
  checkOutButton: null,
};

export default CartContents;
