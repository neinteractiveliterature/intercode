import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import Modal from 'react-bootstrap4-modal';
import { v4 as uuidv4 } from 'uuid';

import AdminOrderForm from './AdminOrderForm';
import { CreateOrder } from './mutations.gql';
import { useConfirm } from '../ModalDialogs/Confirm';
import AdminOrderEntriesTable from './AdminOrderEntriesTable';
import useAsyncFunction from '../useAsyncFunction';
import ErrorDisplay from '../ErrorDisplay';

const BLANK_ORDER = {
  payment_amount: {
    fractional: 0,
    currency_code: 'USD',
  },
  payment_note: '',
  status: 'paid',
  order_entries: [],
};

function NewOrderModal({ visible, close, initialOrder }) {
  const confirm = useConfirm();
  const [order, setOrder] = useState(initialOrder || BLANK_ORDER);
  const [createMutate] = useMutation(CreateOrder);
  const apolloClient = useApolloClient();

  useEffect(
    () => {
      if (!visible) {
        setOrder(initialOrder);
      }
    },
    [visible, initialOrder],
  );

  const createOrder = () => createMutate({
    variables: {
      userConProfileId: order.user_con_profile?.id,
      order: {
        payment_amount: {
          fractional: order.payment_amount?.fractional,
          currency_code: order.payment_amount?.currency_code,
        },
        payment_note: order.payment_note,
      },
      status: order.status,
      orderEntries: order.order_entries.map((orderEntry) => ({
        product_id: orderEntry.product?.id,
        product_variant_id: orderEntry.product_variant?.id,
        quantity: orderEntry.quantity,
        price_per_item: {
          fractional: orderEntry.price_per_item.fractional,
          currency_code: orderEntry.price_per_item.currency_code,
        },
        ticket_id: orderEntry.ticket_id,
      })),
    },
  });
  const [createOrderAsync, createOrderError, createOrderInProgress] = useAsyncFunction(createOrder);

  const createClicked = async () => {
    await createOrderAsync();
    await apolloClient.resetStore();
    close();
  };

  const updateOrder = (attributes) => setOrder((prevOrder) => ({ ...prevOrder, ...attributes }));

  const createOrderEntry = (orderEntry) => setOrder((prevOrder) => ({
    ...prevOrder,
    order_entries: [
      ...prevOrder.order_entries,
      { ...orderEntry, generatedId: uuidv4() },
    ],
  }));

  const updateOrderEntry = (orderEntry, attributes) => setOrder((prevOrder) => ({
    ...prevOrder,
    order_entries: prevOrder.order_entries.map((entry) => {
      if (entry.generatedId === orderEntry.generatedId) {
        return { ...entry, ...attributes };
      }

      return entry;
    }),
  }));

  const deleteOrderEntry = (orderEntry) => setOrder((prevOrder) => ({
    ...prevOrder,
    order_entries: prevOrder.order_entries
      .filter((entry) => entry.generatedId !== orderEntry.generatedId),
  }));

  return (
    <Modal
      visible={visible && !confirm.visible}
      dialogClassName="modal-lg"
    >
      <div className="modal-header">
        New order
      </div>
      <div className="modal-body">
        <AdminOrderForm order={order} updateOrder={updateOrder} />

        <section className="mt-4">
          <AdminOrderEntriesTable
            order={order}
            createOrderEntry={createOrderEntry}
            updateOrderEntry={updateOrderEntry}
            deleteOrderEntry={deleteOrderEntry}
          />
        </section>

        <ErrorDisplay graphQLError={createOrderError} />
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={close}
          disabled={createOrderInProgress}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={createClicked}
          disabled={createOrderInProgress}
        >
          Create
        </button>
      </div>
    </Modal>
  );
}

NewOrderModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.bool.isRequired,
  initialOrder: PropTypes.shape({}),
};

NewOrderModal.defaultProps = {
  initialOrder: null,
};

export default NewOrderModal;
