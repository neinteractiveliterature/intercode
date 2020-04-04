import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import formatMoney from '../formatMoney';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import { parseIntOrNull } from '../ComposableFormUtils';
import InPlaceMoneyEditor from './InPlaceMoneyEditor';
import { useConfirm } from '../ModalDialogs/Confirm';
import ErrorDisplay from '../ErrorDisplay';
import pluralizeWithCount from '../pluralizeWithCount';
import ProductSelect from '../BuiltInFormControls/ProductSelect';
import useAsyncFunction from '../useAsyncFunction';

function AdminOrderEntriesTable({
  order, createOrderEntry, updateOrderEntry, deleteOrderEntry,
}) {
  const confirm = useConfirm();
  const [addingItem, setAddingItem] = useState(null);
  const [createOrderEntryAsync, createError, createInProgress] = useAsyncFunction(
    createOrderEntry,
  );

  const setAddingItemProduct = (product) => {
    setAddingItem((prevAddingItem) => ({
      ...prevAddingItem,
      product,
      product_variant: null,
      price_per_item: product?.pricing_structure?.price,
    }));
  };

  const setAddingItemProductVariant = (variant) => {
    setAddingItem((prevAddingItem) => ({
      ...prevAddingItem,
      product_variant: variant,
      price_per_item: variant?.override_pricing_structure?.price || prevAddingItem.price_per_item,
    }));
  };

  const saveAddingItem = async () => {
    createOrderEntryAsync(addingItem);
    setAddingItem(null);
  };

  return (
    <table className="table table-sm mb-0">
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {order.order_entries.map((orderEntry) => (
          <tr key={orderEntry.id || orderEntry.generatedId}>
            <td>
              {orderEntry.product.name}
              {orderEntry.product_variant && ` (${orderEntry.product_variant.name})`}
            </td>
            <td>
              <InPlaceEditor
                value={orderEntry.quantity.toString()}
                onChange={(newValue) => updateOrderEntry(orderEntry,
                  { quantity: parseIntOrNull(newValue) })}
              />
            </td>
            <td>
              <InPlaceMoneyEditor
                value={orderEntry.price_per_item}
                onChange={(value) => updateOrderEntry(orderEntry, {
                  price_per_item: {
                    fractional: value.fractional,
                    currency_code: value.currency_code,
                  },
                })}
              >
                {formatMoney(orderEntry.price_per_item)}
                {orderEntry.quantity > 1 && ' each'}
              </InPlaceMoneyEditor>
            </td>
            <td>
              <button
                className="btn btn-outline-danger btn-sm"
                type="button"
                aria-label="Delete item"
                onClick={() => confirm({
                  prompt: `Are you sure you want to delete
                    ${pluralizeWithCount(orderEntry.product.name, orderEntry.quantity)} from the
                    order?  This cannot be undone.`,
                  action: () => deleteOrderEntry(orderEntry),
                  renderError: (error) => <ErrorDisplay graphQLError={error} />,
                })}
              >
                <i className="fa fa-trash-o" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        {addingItem && (
          <tr>
            <td>
              <ProductSelect
                value={addingItem.product}
                onChange={setAddingItemProduct}
                isClearable
                disabled={createInProgress}
              />
              {addingItem.product?.product_variants?.length > 0 && (
                <Select
                  options={addingItem.product.product_variants}
                  value={addingItem.product_variant}
                  onChange={setAddingItemProductVariant}
                  getOptionValue={(variant) => variant.id}
                  getOptionLabel={(variant) => variant.name}
                  isClearable
                  disabled={createInProgress}
                />
              )}
            </td>
            <td>
              <InPlaceEditor
                value={addingItem.quantity.toString()}
                onChange={(newValue) => setAddingItem((prev) => ({
                  ...prev, quantity: parseIntOrNull(newValue),
                }))}
                disabled={createInProgress}
              />
            </td>
            <td>
              <InPlaceMoneyEditor
                value={addingItem.price_per_item}
                onChange={(value) => setAddingItem((prev) => ({ ...prev, price_per_item: value }))}
                disabled={createInProgress}
              >
                {formatMoney(addingItem.price_per_item)}
                {addingItem.quantity > 1 && ' each'}
              </InPlaceMoneyEditor>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={saveAddingItem}
                disabled={createInProgress}
              >
                Add
              </button>
            </td>
          </tr>
        )}
        {createError && (
          <tr>
            <td colSpan={4}><ErrorDisplay graphQLError={createError} /></td>
          </tr>
        )}
        <tr className="font-italic">
          <td>
            {!addingItem && (
              <button
                className="btn btn-sm btn-outline-primary"
                type="button"
                onClick={() => setAddingItem({
                  product: null, product_variant: null, quantity: 1, price_per_item: null,
                })}
              >
                Add item(s)
              </button>
            )}
          </td>
          <td>
            Total price
          </td>
          <td>
            {formatMoney(order.total_price)}
          </td>
          <td />
        </tr>
      </tfoot>
    </table>
  );
}

AdminOrderEntriesTable.propTypes = {
  order: PropTypes.shape({
    order_entries: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    total_price: PropTypes.shape({}).isRequired,
  }).isRequired,
  createOrderEntry: PropTypes.func.isRequired,
  updateOrderEntry: PropTypes.func.isRequired,
  deleteOrderEntry: PropTypes.func.isRequired,
};

export default AdminOrderEntriesTable;
