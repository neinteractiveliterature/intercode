import { useCallback } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';

import AdminOrderForm, { AdminOrderTypeWithId } from './AdminOrderForm';
import AdminOrderEntriesTable, { AdminOrderEntryWithIdType } from './AdminOrderEntriesTable';
import {
  Coupon,
  CouponApplication,
  OrderEntryInput,
  UpdateOrderEntryInput,
  UpdateOrderInput,
} from 'graphqlTypes.generated';
import { useTranslation } from 'react-i18next';
import { useFetcher } from 'react-router';
import { ApolloError } from '@apollo/client';

export type EditOrderModalProps = {
  order: AdminOrderTypeWithId & {
    order_entries: (Omit<AdminOrderEntryWithIdType, 'product'> & {
      product: NonNullable<AdminOrderEntryWithIdType['product']> & { id: string };
    })[];
    coupon_applications: (Pick<CouponApplication, 'discount'> & {
      id: string;
      coupon: Pick<Coupon, 'code'>;
    })[];
  };
  closeModal: () => void;
};

export default function EditOrderModal({ order, closeModal }: EditOrderModalProps): React.JSX.Element {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const createFetcher = useFetcher();
  const createError = createFetcher.data instanceof Error ? createFetcher.data : undefined;

  const updateOrder = useCallback(
    (attributes: UpdateOrderInput['order']) => {
      const input: UpdateOrderInput['order'] = {
        ...attributes,
        payment_amount: attributes.payment_amount
          ? { currency_code: attributes.payment_amount.currency_code, fractional: attributes.payment_amount.fractional }
          : null,
      };
      fetcher.submit(input, {
        action: `/admin_store/orders/${order.id}`,
        method: 'PATCH',
        encType: 'application/json',
      });
    },

    [fetcher, order.id],
  );

  const createOrderEntry = useCallback(
    (orderEntry: NonNullable<EditOrderModalProps['order']>['order_entries'][0]) => {
      const attributes: OrderEntryInput = {
        productId: orderEntry.product.id,
        productVariantId: orderEntry.product_variant?.id,
        quantity: orderEntry.quantity,
        price_per_item: {
          currency_code: orderEntry.price_per_item.currency_code,
          fractional: orderEntry.price_per_item.fractional,
        },
      };
      createFetcher.submit(attributes, {
        action: `/admin_store/orders/${order.id}/order_entries`,
        method: 'POST',
        encType: 'application/json',
      });
    },
    [createFetcher, order.id],
  );

  const updateOrderEntry = useCallback(
    (
      orderEntry: EditOrderModalProps['order']['order_entries'][number],
      attributes: UpdateOrderEntryInput['order_entry'],
    ) =>
      fetcher.submit(attributes, {
        action: `/admin_store/orders/${order.id}/order_entries/${orderEntry.id}`,
        method: 'PATCH',
        encType: 'application/json',
      }),
    [fetcher, order.id],
  );

  const deleteOrderEntry = useCallback(
    (orderEntry: EditOrderModalProps['order']['order_entries'][number]) =>
      fetcher.submit(null, {
        action: `/admin_store/orders/${order.id}/order_entries/${orderEntry.id}`,
        method: 'DELETE',
      }),
    [fetcher, order.id],
  );

  const createCouponApplication = useCallback(
    (couponCode: string) =>
      fetcher.submit(
        { coupon_code: couponCode },
        { method: 'POST', action: `/admin_store/orders/${order.id}/coupon_applications` },
      ),
    [fetcher, order.id],
  );

  const deleteCouponApplication = useCallback(
    (couponApplication: NonNullable<EditOrderModalProps['order']>['coupon_applications'][number]) =>
      fetcher.submit(null, {
        action: `/admin_store/orders/${order.id}/coupon_applications/${couponApplication.id}`,
        method: 'DELETE',
      }),
    [fetcher, order.id],
  );

  return (
    <Modal visible={order != null && !confirm.visible} dialogClassName="modal-lg">
      <div className="modal-header">{t('store.editOrder.header', { orderId: order?.id })}</div>
      <div className="modal-body">
        {order && (
          <>
            <AdminOrderForm order={order} updateOrder={updateOrder} />

            <section className="mt-4">
              <AdminOrderEntriesTable
                order={order}
                createOrderEntry={createOrderEntry}
                updateOrderEntry={updateOrderEntry}
                deleteOrderEntry={deleteOrderEntry}
                createCouponApplication={createCouponApplication}
                deleteCouponApplication={deleteCouponApplication}
                createError={createError as ApolloError | undefined}
                createInProgress={createFetcher.state !== 'idle'}
              />
            </section>

            <ErrorDisplay graphQLError={error as ApolloError | undefined} />
          </>
        )}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={closeModal}>
          {t('buttons.close')}
        </button>
      </div>
    </Modal>
  );
}
