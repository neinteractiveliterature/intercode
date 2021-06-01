import { useCallback } from 'react';
import Modal from 'react-bootstrap4-modal';
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
import { Coupon, CouponApplication, Product } from '../graphqlTypes.generated';

export type EditOrderModalProps = {
  order?: AdminOrderTypeWithId & {
    order_entries: (Omit<AdminOrderEntryWithIdType, 'product'> & {
      product: NonNullable<AdminOrderEntryWithIdType['product']> & Pick<Product, 'id'>;
    })[];
    coupon_applications: (Pick<CouponApplication, 'id' | 'discount'> & {
      coupon: Pick<Coupon, 'code'>;
    })[];
  };
  closeModal: () => void;
};

function EditOrderModal({ order, closeModal }: EditOrderModalProps) {
  const confirm = useConfirm();
  const [updateMutate] = useAdminUpdateOrderMutation();
  const [createOrderEntryMutate] = useAdminCreateOrderEntryMutation();
  const [updateOrderEntryMutate] = useAdminUpdateOrderEntryMutation();
  const [deleteOrderEntryMutate] = useAdminDeleteOrderEntryMutation();
  const [createCouponApplicationMutate] = useCreateCouponApplicationMutation();
  const [deleteCouponApplicationMutate] = useDeleteCouponApplicationMutation();

  const updateOrder = useCallback(
    (attributes) =>
      updateMutate({
        variables: {
          id: order!.id,
          order: attributes,
        },
      }),
    [order, updateMutate],
  );

  const createOrderEntry = useCallback(
    (orderEntry: NonNullable<EditOrderModalProps['order']>['order_entries'][0]) =>
      createOrderEntryMutate({
        variables: {
          input: {
            order_id: order!.id,
            order_entry: {
              product_id: orderEntry.product.id,
              product_variant_id: orderEntry.product_variant?.id,
              quantity: orderEntry.quantity,
              price_per_item: orderEntry.price_per_item,
            },
          },
        },
      }),
    [createOrderEntryMutate, order],
  );

  const updateOrderEntry = useCallback(
    (orderEntry, attributes) =>
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
    (orderEntry) => deleteOrderEntryMutate({ variables: { input: { id: orderEntry.id } } }),
    [deleteOrderEntryMutate],
  );

  const createCouponApplication = useCallback(
    (couponCode) =>
      createCouponApplicationMutate({
        variables: {
          orderId: order!.id,
          couponCode,
        },
      }),
    [createCouponApplicationMutate, order],
  );

  const deleteCouponApplication = useCallback(
    (couponApplication) =>
      deleteCouponApplicationMutate({
        variables: { id: couponApplication.id },
      }),
    [deleteCouponApplicationMutate],
  );

  return (
    <Modal visible={order != null && !confirm.visible} dialogClassName="modal-lg">
      <div className="modal-header">Order #{(order || {}).id}</div>
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
          Close
        </button>
      </div>
    </Modal>
  );
}

export default EditOrderModal;
