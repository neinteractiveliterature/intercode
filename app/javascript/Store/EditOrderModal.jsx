import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import Modal from 'react-bootstrap4-modal';

import AdminOrderForm from './AdminOrderForm';
import {
  AdminUpdateOrder, AdminCreateOrderEntry, AdminUpdateOrderEntry, AdminDeleteOrderEntry,
} from './mutations.gql';
import { useConfirm } from '../ModalDialogs/Confirm';
import AdminOrderEntriesTable from './AdminOrderEntriesTable';

function EditOrderModal({ order, closeModal }) {
  const confirm = useConfirm();
  const [updateMutate] = useMutation(AdminUpdateOrder);
  const [createOrderEntryMutate] = useMutation(AdminCreateOrderEntry);
  const [updateOrderEntryMutate] = useMutation(AdminUpdateOrderEntry);
  const [deleteOrderEntryMutate] = useMutation(AdminDeleteOrderEntry);

  const updateOrder = useCallback(
    (attributes) => updateMutate({
      variables: {
        id: order?.id,
        order: attributes,
      },
    }),
    [order, updateMutate],
  );

  const createOrderEntry = useCallback(
    (orderEntry) => createOrderEntryMutate({
      variables: {
        input: {
          order_id: order.id,
          order_entry: {
            product_id: orderEntry.product?.id,
            product_variant_id: orderEntry.product_variant?.id,
            quantity: orderEntry.quantity,
            price_per_item: {
              fractional: orderEntry.price_per_item?.fractional,
              currency_code: orderEntry.price_per_item?.currency_code,
            },
          },
        },
      },
    }),
    [createOrderEntryMutate, order],
  );

  const updateOrderEntry = useCallback(
    (orderEntry, attributes) => updateOrderEntryMutate({
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

  return (
    <Modal
      visible={order != null && !confirm.visible}
      dialogClassName="modal-lg"
    >
      <div className="modal-header">
        Order #
        {(order || {}).id}
      </div>
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
              />
            </section>
          </>
        )}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={closeModal}>Close</button>
      </div>
    </Modal>
  );
}

EditOrderModal.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  closeModal: PropTypes.func.isRequired,
};

EditOrderModal.defaultProps = {
  order: null,
};

export default EditOrderModal;
