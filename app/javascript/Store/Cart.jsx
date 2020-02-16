import React, { useCallback } from 'react';
import intersection from 'lodash-es/intersection';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { CartQuery } from './queries.gql';
import { DeleteOrderEntry, UpdateOrderEntry } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import formatMoney from '../formatMoney';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import OrderPaymentModal from './OrderPaymentModal';
import useModal from '../ModalDialogs/useModal';
import useAsyncFunction from '../useAsyncFunction';
import { useConfirm } from '../ModalDialogs/Confirm';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function Cart() {
  const history = useHistory();
  const { data, loading, error } = useQuery(CartQuery);
  const [updateMutate] = useMutation(UpdateOrderEntry);
  const [deleteMutate] = useMutation(DeleteOrderEntry);
  const checkOutModal = useModal();
  const confirm = useConfirm();

  usePageTitle('Cart');

  const updateOrderEntry = useCallback(
    (id, quantity) => updateMutate({
      variables: { input: { id, order_entry: { quantity } } },
    }),
    [updateMutate],
  );

  const deleteOrderEntry = useCallback(
    (id) => deleteMutate({
      variables: { input: { id } },
      update: (proxy) => {
        const storeData = proxy.readQuery({ query: CartQuery });
        storeData.currentPendingOrder.order_entries = storeData.currentPendingOrder.order_entries
          .filter((entry) => entry.id !== id);
        proxy.writeQuery({ query: CartQuery, data: storeData });
      },
    }),
    [deleteMutate],
  );

  const [changeQuantity, changeQuantityError] = useAsyncFunction(useCallback(
    async (orderEntryId, newQuantityString) => {
      const newQuantity = Number.parseInt(newQuantityString, 10);
      if (Number.isNaN(newQuantity)) {
        return;
      }

      if (newQuantity === 0) {
        await deleteOrderEntry(orderEntryId);
      } else {
        await updateOrderEntry(orderEntryId, newQuantity);
      }
    },
    [deleteOrderEntry, updateOrderEntry],
  ));

  const checkOutComplete = () => { history.push('/order_history'); };

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (loading) {
    return <PageLoadingIndicator visible />;
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
        <InPlaceEditor
          value={entry.quantity.toString()}
          onChange={(newValue) => { changeQuantity(entry.id, newValue); }}
        />
      </td>
      <td>{formatMoney(entry.price)}</td>
      <td>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => {
            let { name } = entry.product;
            if (entry.product_variant) {
              name += ` (${entry.product_variant.name})`;
            }

            confirm({
              prompt: `Are you sure you want to remove ${name} from your cart?`,
              action: () => deleteOrderEntry(entry.id),
              renderError: (e) => <ErrorDisplay graphQLError={e} />,
            });
          }}
        >
          <i className="fa fa-trash-o" />
          <span className="sr-only">Remove from cart</span>
        </button>
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
    <div>
      <h1 className="mb-4">Shopping cart</h1>

      <ErrorDisplay graphQLError={changeQuantityError} />

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
              <button type="button" className="btn btn-primary mt-2" onClick={checkOutModal.open}>
                <i className="fa fa-shopping-cart" />
                {' '}
                Check out
              </button>
            </td>
            <td />
          </tr>
        </tfoot>
      </table>

      <OrderPaymentModal
        visible={checkOutModal.visible}
        onCancel={checkOutModal.close}
        initialName={data.myProfile.name_without_nickname}
        orderId={(data.currentPendingOrder || {}).id}
        onComplete={checkOutComplete}
        paymentOptions={
          intersection(
            ...((data.currentPendingOrder || {}).order_entries || [])
              .map((entry) => entry.product.payment_options),
          )
        }
      />
    </div>
  );
}

export default Cart;
