import { useState } from 'react';
import Select from 'react-select';
import { ApolloError } from '@apollo/client';
import { parseIntOrNull, useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import formatMoney from '../formatMoney';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import InPlaceMoneyEditor from './InPlaceMoneyEditor';
import pluralizeWithCount from '../pluralizeWithCount';
import ProductSelect from '../BuiltInFormControls/ProductSelect';
import useAsyncFunction from '../useAsyncFunction';
import ApplyCouponControl from './ApplyCouponControl';
import {
  Coupon,
  CouponApplication,
  Money,
  OrderEntry,
  PricingStructure,
  Product,
  ProductVariant,
} from '../graphqlTypes.generated';

type ProductVariantType = Pick<ProductVariant, '__typename' | 'id' | 'name'> & {
  override_pricing_structure?: Pick<PricingStructure, 'price'> | null;
};

type CommonOrderEntryProps = Pick<OrderEntry, 'quantity' | 'price_per_item'> & {
  product: Pick<Product, '__typename' | 'id' | 'name'> & {
    product_variants?: ProductVariantType[] | null;
    pricing_structure?: Pick<PricingStructure, 'price'> | null;
  };
  product_variant?: ProductVariantType | null;
};

export type AdminOrderEntryWithIdType = CommonOrderEntryProps & {
  id: number;
};

type OrderEntryWithGeneratedIdType = CommonOrderEntryProps & {
  generatedId: string;
};

export type AdminOrderEntryType = AdminOrderEntryWithIdType | OrderEntryWithGeneratedIdType;

type AddingOrderEntry<T extends AdminOrderEntryType> = Omit<T, 'product' | 'price_per_item'> & {
  product?: T['product'] | null;
  price_per_item?: T['price_per_item'] | null;
};

function orderEntryHasId(orderEntry: AdminOrderEntryType): orderEntry is AdminOrderEntryWithIdType {
  return 'id' in orderEntry && orderEntry.id != null;
}

function getEffectiveId(orderEntry: AdminOrderEntryType) {
  if (orderEntryHasId(orderEntry)) {
    return orderEntry.id;
  }

  return orderEntry.generatedId;
}

type CouponApplicationForOrderEntriesTable = Partial<Pick<CouponApplication, 'id' | 'discount'>> & {
  coupon: Pick<Coupon, 'code'>;
};

export type AdminOrderEntriesTableProps<
  T extends AdminOrderEntryType,
  CouponApplicationType extends CouponApplicationForOrderEntriesTable,
> = {
  order: {
    order_entries: T[];
    total_price?: Money;
    coupon_applications: CouponApplicationType[];
  };
  createOrderEntry: (orderEntry: T) => Promise<unknown>;
  updateOrderEntry: (orderEntry: T, attributes: Partial<T>) => Promise<unknown>;
  deleteOrderEntry: (orderEntry: T) => Promise<unknown>;
  createCouponApplication: (code: string) => Promise<unknown>;
  deleteCouponApplication: (couponApplication: CouponApplicationType) => Promise<unknown>;
};

function AdminOrderEntriesTable<
  T extends AdminOrderEntryType,
  CouponApplicationType extends CouponApplicationForOrderEntriesTable,
>({
  order,
  createOrderEntry,
  updateOrderEntry,
  deleteOrderEntry,
  createCouponApplication,
  deleteCouponApplication,
}: AdminOrderEntriesTableProps<T, CouponApplicationType>): JSX.Element {
  const confirm = useConfirm();
  const [addingItem, setAddingItem] = useState<AddingOrderEntry<T>>();
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [createOrderEntryAsync, createError, createInProgress] = useAsyncFunction(createOrderEntry);

  const applyCoupon = async (code: string) => {
    await createCouponApplication(code);
    setApplyingCoupon(false);
  };

  const setAddingItemProduct = (product: T['product']) => {
    setAddingItem(
      (prevAddingItem) =>
        ({
          ...prevAddingItem,
          product,
          product_variant: null,
          price_per_item: product?.pricing_structure?.price,
        } as T),
    );
  };

  const setAddingItemProductVariant: (variant: NonNullable<T['product_variant']> | null) => void = (
    variant,
  ) => {
    setAddingItem(
      (prevAddingItem) =>
        ({
          ...prevAddingItem,
          product_variant: variant,
          price_per_item:
            variant?.override_pricing_structure?.price ?? prevAddingItem?.price_per_item,
        } as T),
    );
  };

  const saveAddingItem = async () => {
    if (!addingItem || !addingItem.product) {
      return;
    }

    createOrderEntryAsync(addingItem as T);
    setAddingItem(undefined);
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
          <tr key={getEffectiveId(orderEntry)}>
            <td>
              {orderEntry.product.name}
              {orderEntry.product_variant && ` (${orderEntry.product_variant.name})`}
            </td>
            <td>
              <InPlaceEditor
                value={orderEntry.quantity.toString()}
                onChange={(newValue) =>
                  updateOrderEntry(orderEntry, { quantity: parseIntOrNull(newValue) } as Partial<T>)
                }
              />
            </td>
            <td>
              <InPlaceMoneyEditor
                value={orderEntry.price_per_item}
                onChange={(value) =>
                  updateOrderEntry(orderEntry, { price_per_item: value } as Partial<T>)
                }
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
                onClick={() =>
                  confirm({
                    prompt: `Are you sure you want to delete
                    ${pluralizeWithCount(orderEntry.product.name, orderEntry.quantity)} from the
                    order?  This cannot be undone.`,
                    action: () => deleteOrderEntry(orderEntry),
                    renderError: (error) => <ErrorDisplay graphQLError={error} />,
                  })
                }
              >
                <i className="bi-trash" />
              </button>
            </td>
          </tr>
        ))}
        {(order.coupon_applications ?? []).map((couponApplication) => (
          <tr key={couponApplication.id} className="bg-light">
            <td colSpan={2}>
              <em>{'Coupon code: '}</em>
              <code>{couponApplication.coupon.code}</code>
            </td>
            <td className="font-italic">-{formatMoney(couponApplication.discount)}</td>
            <td>
              <button
                className="btn btn-outline-danger btn-sm"
                type="button"
                aria-label="Delete item"
                onClick={() =>
                  confirm({
                    prompt: `Are you sure you want to delete this coupon from the order?  This
                    cannot be undone.`,
                    action: () => deleteCouponApplication(couponApplication),
                    renderError: (error) => <ErrorDisplay graphQLError={error} />,
                  })
                }
              >
                <i className="bi-trash" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        {addingItem && (
          <tr className="bg-success-light">
            <td>
              <ProductSelect
                value={addingItem.product}
                onChange={setAddingItemProduct}
                isClearable
                disabled={createInProgress}
              />
              {(addingItem.product?.product_variants?.length ?? 0) > 0 && (
                <Select
                  options={addingItem.product?.product_variants ?? []}
                  value={addingItem.product_variant}
                  onChange={setAddingItemProductVariant}
                  getOptionValue={(variant) => variant.id?.toString() ?? ''}
                  getOptionLabel={(variant) => variant.name}
                  isClearable
                  disabled={createInProgress}
                />
              )}
            </td>
            <td>
              <InPlaceEditor
                value={addingItem.quantity.toString()}
                onChange={(newValue) =>
                  setAddingItem(
                    (prev) =>
                      ({
                        ...prev,
                        quantity: parseIntOrNull(newValue),
                      } as T),
                  )
                }
              />
            </td>
            <td>
              <InPlaceMoneyEditor
                value={addingItem.price_per_item}
                onChange={(value) =>
                  setAddingItem((prev) => ({ ...prev, price_per_item: value } as T))
                }
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
            <td colSpan={4}>
              <ErrorDisplay graphQLError={createError as ApolloError} />
            </td>
          </tr>
        )}
        {applyingCoupon && (
          <tr className="bg-success-light">
            <td colSpan={4}>
              <ApplyCouponControl createCouponApplication={applyCoupon} />
            </td>
          </tr>
        )}
        <tr className="font-italic bg-warning-light">
          <td>
            {!addingItem && (
              <button
                className="btn btn-sm btn-outline-primary me-2"
                type="button"
                onClick={() =>
                  setAddingItem({
                    product: undefined,
                    product_variant: undefined,
                    quantity: 1,
                    price_per_item: undefined,
                  } as AddingOrderEntry<T>)
                }
              >
                Add item(s)
              </button>
            )}
            {!applyingCoupon && (
              <button
                className="btn btn-sm btn-outline-primary"
                type="button"
                onClick={() => setApplyingCoupon(true)}
              >
                Add coupon
              </button>
            )}
          </td>
          <td>Total price</td>
          <td>{formatMoney(order.total_price)}</td>
          <td />
        </tr>
      </tfoot>
    </table>
  );
}

export default AdminOrderEntriesTable;
