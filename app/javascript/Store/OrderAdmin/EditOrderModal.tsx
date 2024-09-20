import { useCallback } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { useConfirm } from '@neinteractiveliterature/litform';

import AdminOrderForm, { AdminOrderTypeWithId } from './AdminOrderForm';
import AdminOrderEntriesTable, { AdminOrderEntryWithIdType } from './AdminOrderEntriesTable';
import {
  useAdminCreateOrderEntryMutation,
  useAdminDeleteOrderEntryMutation,
  useAdminUpdateOrderEntryMutation,
  useAdminUpdateOrderMutation,
  useCreateCouponApplicationMutation,
  useDeleteCouponApplicationMutation,
} from './mutations.generated';
import { Coupon, CouponApplication, UpdateOrderEntryInput, UpdateOrderInput } from 'graphqlTypes.generated';
import { useTranslation } from 'react-i18next';

export type EditOrderModalProps = {
  order?: AdminOrderTypeWithId & {
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

function EditOrderModal({ order, closeModal }: EditOrderModalProps): JSX.Element {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const [updateMutate] = useAdminUpdateOrderMutation();
  const [createOrderEntryMutate] = useAdminCreateOrderEntryMutation();
  const [updateOrderEntryMutate] = useAdminUpdateOrderEntryMutation();
  const [deleteOrderEntryMutate] = useAdminDeleteOrderEntryMutation();
  const [createCouponApplicationMutate] = useCreateCouponApplicationMutation();
  const [deleteCouponApplicationMutate] = useDeleteCouponApplicationMutation();

  const updateOrder = useCallback(
    (attributes: UpdateOrderInput['order']) => {
      if (!order) {
        return;
      }
      return updateMutate({
        variables: {
          id: order.id,
          order: attributes,
        },
      });
    },
    [order, updateMutate],
  );

  const createOrderEntry = useCallback(
    async (orderEntry: NonNullable<EditOrderModalProps['order']>['order_entries'][0]) => {
      if (!order) {
        return;
      }
      await createOrderEntryMutate({
        variables: {
          input: {
            orderId: order.id,
            order_entry: {
              productId: orderEntry.product.id,
              productVariantId: orderEntry.product_variant?.id,
              quantity: orderEntry.quantity,
              price_per_item: {
                currency_code: orderEntry.price_per_item.currency_code,
                fractional: orderEntry.price_per_item.fractional,
              },
            },
          },
        },
      });
    },
    [createOrderEntryMutate, order],
  );

  const updateOrderEntry = useCallback(
    (
      orderEntry: NonNullable<EditOrderModalProps['order']>['order_entries'][0],
      attributes: UpdateOrderEntryInput['order_entry'],
    ) =>
      updateOrderEntryMutate({
        variables: {
          input: {
            id: orderEntry.id,
            order_entry: attributes,
          },
        },
      }),
    [updateOrderEntryMutate],
  );

  const deleteOrderEntry = useCallback(
    (orderEntry: NonNullable<EditOrderModalProps['order']>['order_entries'][0]) =>
      deleteOrderEntryMutate({ variables: { input: { id: orderEntry.id } } }),
    [deleteOrderEntryMutate],
  );

  const createCouponApplication = useCallback(
    async (couponCode: string) => {
      if (!order) {
        return;
      }
      await createCouponApplicationMutate({
        variables: {
          orderId: order.id,
          couponCode,
        },
      });
    },
    [createCouponApplicationMutate, order],
  );

  const deleteCouponApplication = useCallback(
    (couponApplication: NonNullable<EditOrderModalProps['order']>['coupon_applications'][number]) =>
      deleteCouponApplicationMutate({
        variables: { id: couponApplication.id },
      }),
    [deleteCouponApplicationMutate],
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
              />
            </section>
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

export const Component = EditOrderModal;
