import { useState } from 'react';
import Select from 'react-select';
import { ApolloError } from '@apollo/client';
import { parseIntOrNull, useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import { useTranslation } from 'react-i18next';
import {
  Coupon,
  CouponApplication,
  Money,
  OrderEntry,
  PricingStructure,
  Product,
  ProductVariant,
} from 'graphqlTypes.generated';
import InPlaceEditor from 'BuiltInFormControls/InPlaceEditor';
import InPlaceMoneyEditor from 'Store/InPlaceMoneyEditor';
import formatMoney from 'formatMoney';
import ProductSelect from 'BuiltInFormControls/ProductSelect';
import ApplyCouponControl from 'Store/ApplyCouponControl';

type ProductVariantType = Pick<ProductVariant, '__typename' | 'name'> & {
  id: string;
  override_pricing_structure?: Pick<PricingStructure, 'price'> | null;
};

type CommonOrderEntryProps = Pick<OrderEntry, 'quantity' | 'price_per_item'> & {
  product: Pick<Product, '__typename' | 'name'> & {
    id: string;
    product_variants?: ProductVariantType[] | null;
    pricing_structure?: Pick<PricingStructure, 'price'> | null;
  };
  product_variant?: ProductVariantType | null;
};

export type AdminOrderEntryWithIdType = CommonOrderEntryProps & {
  id: string;
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
  createOrderEntry: (orderEntry: T) => unknown;
  updateOrderEntry: (orderEntry: T, attributes: Partial<T>) => unknown;
  deleteOrderEntry: (orderEntry: T) => unknown;
  createCouponApplication: (code: string) => unknown;
  deleteCouponApplication: (couponApplication: CouponApplicationType) => unknown;
  createError: ApolloError | undefined;
  createInProgress: boolean;
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
  createError,
  createInProgress,
}: AdminOrderEntriesTableProps<T, CouponApplicationType>): JSX.Element {
  const confirm = useConfirm();
  const [addingItem, setAddingItem] = useState<AddingOrderEntry<T>>();
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const { t } = useTranslation();

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
        }) as T,
    );
  };

  const setAddingItemProductVariant: (variant: NonNullable<T['product_variant']> | null) => void = (variant) => {
    setAddingItem(
      (prevAddingItem) =>
        ({
          ...prevAddingItem,
          product_variant: variant,
          price_per_item: variant?.override_pricing_structure?.price ?? prevAddingItem?.price_per_item,
        }) as T,
    );
  };

  const saveAddingItem = async () => {
    if (!addingItem || !addingItem.product) {
      return;
    }

    createOrderEntry({
      price_per_item: addingItem.price_per_item
        ? {
            currency_code: addingItem.price_per_item.currency_code,
            fractional: addingItem.price_per_item.fractional,
          }
        : undefined,
      product: addingItem.product,
      quantity: addingItem.quantity,
      product_variant: addingItem.product_variant,
    } as T);
    setAddingItem(undefined);
  };

  return (
    <table className="table table-sm mb-0">
      <thead>
        <tr>
          <th>{t('admin.store.orderEntries.itemColumnHeader')}</th>
          <th>{t('admin.store.orderEntries.quantityColumnHeader')}</th>
          <th>{t('admin.store.orderEntries.priceColumnHeader')}</th>
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
                onChange={(newValue) => {
                  updateOrderEntry(orderEntry, { quantity: parseIntOrNull(newValue) } as Partial<T>);
                }}
              />
            </td>
            <td>
              <InPlaceMoneyEditor
                value={orderEntry.price_per_item}
                onChange={(value) => {
                  if (typeof value === 'function') {
                    const newValue = value(orderEntry.price_per_item);
                    updateOrderEntry(orderEntry, {
                      price_per_item: newValue
                        ? { currency_code: newValue.currency_code, fractional: newValue.fractional }
                        : undefined,
                    } as Partial<T>);
                  } else {
                    updateOrderEntry(orderEntry, {
                      price_per_item: value
                        ? { currency_code: value.currency_code, fractional: value.fractional }
                        : undefined,
                    } as Partial<T>);
                  }
                }}
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
                    prompt: t('admin.store.orderEntries.deleteConfirmation', {
                      count: orderEntry.quantity,
                      productName: orderEntry.product.name,
                    }),
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
              <em>{t('admin.store.orderEntries.couponCodeLabel')}</em>
              <code>{couponApplication.coupon.code}</code>
            </td>
            <td className="font-italic">
              {couponApplication.discount &&
                formatMoney({ ...couponApplication.discount, fractional: couponApplication.discount.fractional * -1 })}
            </td>
            <td>
              <button
                className="btn btn-outline-danger btn-sm"
                type="button"
                aria-label={t('admin.store.orderEntries.deleteCouponLabel')}
                onClick={() =>
                  confirm({
                    prompt: t('admin.store.orderEntries.deleteCouponConfirmation'),
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
                isDisabled={createInProgress}
              />
              {(addingItem.product?.product_variants?.length ?? 0) > 0 && (
                <Select
                  options={addingItem.product?.product_variants ?? []}
                  value={addingItem.product_variant}
                  onChange={setAddingItemProductVariant}
                  getOptionValue={(variant) => variant?.id?.toString() ?? ''}
                  getOptionLabel={(variant) => variant?.name ?? ''}
                  isClearable
                  isDisabled={createInProgress}
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
                      }) as T,
                  )
                }
              />
            </td>
            <td>
              <InPlaceMoneyEditor
                value={addingItem.price_per_item}
                onChange={(value) =>
                  setAddingItem(
                    (prev) =>
                      ({
                        ...prev,
                        price_per_item: value,
                      }) as T,
                  )
                }
                disabled={createInProgress}
              >
                {formatMoney(addingItem.price_per_item)}
                {addingItem.quantity > 1 && ` ${t('admin.store.orderEntries.pricePerEachSuffix')}`}
              </InPlaceMoneyEditor>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={saveAddingItem}
                disabled={createInProgress}
              >
                {t('buttons.add')}
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
                {t('admin.store.orderEntries.addItem')}
              </button>
            )}
            {!applyingCoupon && (
              <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => setApplyingCoupon(true)}>
                {t('admin.store.orderEntries.addCouponLabel')}
              </button>
            )}
          </td>
          <td>{t('admin.store.orderEntries.totalPrice')}</td>
          <td>{formatMoney(order.total_price)}</td>
          <td />
        </tr>
      </tfoot>
    </table>
  );
}

export default AdminOrderEntriesTable;
