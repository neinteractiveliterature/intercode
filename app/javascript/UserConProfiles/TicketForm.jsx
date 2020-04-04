import React, { useState, useMemo, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'inflected';

import BootstrapFormSelect from '../BuiltInFormControls/BootstrapFormSelect';
import ErrorDisplay from '../ErrorDisplay';
import EventSelect from '../BuiltInFormControls/EventSelect';
import sortTicketTypes from '../TicketTypeAdmin/sortTicketTypes';
import useAsyncFunction from '../useAsyncFunction';
import FormGroupWithLabel from '../BuiltInFormControls/FormGroupWithLabel';
import useModal from '../ModalDialogs/useModal';
import formatMoney from '../formatMoney';
import EditOrderModal from '../Store/EditOrderModal';
import NewOrderModal from '../Store/NewOrderModal';
import AppRootContext from '../AppRootContext';

function TicketForm({
  initialTicket, convention, onSubmit, submitCaption,
}) {
  const { myProfile } = useContext(AppRootContext);
  const editOrderModal = useModal();
  const newOrderModal = useModal();
  const [ticketTypeId, setTicketTypeId] = useState(initialTicket.ticket_type?.id);
  const [providedByEvent, setProvidedByEvent] = useState(initialTicket.provided_by_event);

  const providingProduct = useMemo(
    () => {
      if (!initialTicket.id) {
        return null;
      }

      const ticketType = convention.ticket_types
        .find((tt) => tt.id === initialTicket.ticket_type.id);
      return (ticketType.providing_products ?? [])[0];
    },
    [initialTicket, convention],
  );

  const sortedTicketTypes = useMemo(
    () => sortTicketTypes(convention.ticket_types),
    [convention.ticket_types],
  );

  const ticketInput = useMemo(
    () => ({
      ticket_type_id: Number.parseInt(ticketTypeId, 10),
      provided_by_event_id: providedByEvent?.id,
    }),
    [providedByEvent, ticketTypeId],
  );

  const [submit, submitError, submitInProgress] = useAsyncFunction(onSubmit);

  const submitForm = useCallback(
    async (event) => {
      event.preventDefault();
      await submit(ticketInput);
    },
    [submit, ticketInput],
  );

  return (
    <form onSubmit={submitForm}>
      <BootstrapFormSelect
        label={`${capitalize(convention.ticket_name)} type`}
        value={ticketTypeId}
        onValueChange={setTicketTypeId}
      >
        <option aria-label="Blank placeholder option" />
        {sortedTicketTypes.map(({ id, description }) => (
          <option value={id} key={id}>{description}</option>
        ))}
      </BootstrapFormSelect>

      <FormGroupWithLabel label="Provided by event (if applicable)">
        {(id) => (
          <EventSelect
            inputId={id}
            value={providedByEvent}
            onChange={setProvidedByEvent}
          />
        )}
      </FormGroupWithLabel>

      <div className="card mb-4">
        <div className="card-header">Order information</div>

        <div className="card-body">
          {initialTicket.order_entry
            ? (
              <>
                <dl className="row">
                  <dt className="col-md-3">Order ID</dt>
                  <dd className="col-md-9">{initialTicket.order_entry.order.id}</dd>

                  <dt className="col-md-3">
                    {capitalize(convention.ticket_name)}
                    {' '}
                    price
                  </dt>
                  <dd className="col-md-9">
                    {formatMoney(initialTicket.order_entry.price_per_item)}
                  </dd>
                </dl>

                <button
                  className="btn btn-outline-primary"
                  onClick={() => editOrderModal.open({ order: initialTicket.order_entry.order })}
                  type="button"
                >
                  Edit order
                </button>
              </>
            )
            : (providingProduct && (
              <button
                className="btn btn-outline-primary"
                onClick={newOrderModal.open}
                type="button"
              >
                Add order
              </button>
            ))}
        </div>
      </div>

      {providingProduct && (
        <NewOrderModal
          visible={newOrderModal.visible}
          close={newOrderModal.close}
          initialOrder={{
            user_con_profile: initialTicket.user_con_profile,
            payment_amount: providingProduct.pricing_structure.price,
            status: 'paid',
            payment_note: `Entered manually by ${myProfile.name_without_nickname}`,
            order_entries: [
              {
                generatedId: 'ticket',
                product: providingProduct,
                product_variant: null,
                quantity: 1,
                price_per_item: providingProduct.pricing_structure.price,
                ticket_id: initialTicket.id,
              },
            ],
          }}
        />
      )}
      <EditOrderModal order={editOrderModal.state?.order} closeModal={editOrderModal.close} />

      <ErrorDisplay graphQLError={submitError} />

      <input
        type="submit"
        aria-label={submitCaption}
        value={submitCaption}
        className="btn btn-primary"
        disabled={submitInProgress}
      />
    </form>
  );
}

TicketForm.propTypes = {
  convention: PropTypes.shape({
    ticket_name: PropTypes.string.isRequired,
    ticket_types: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  initialTicket: PropTypes.shape({
    ticket_type: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
    provided_by_event: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitCaption: PropTypes.string.isRequired,
};

export default TicketForm;
