import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'inflected';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import BootstrapFormSelect from '../BuiltInFormControls/BootstrapFormSelect';
import ErrorDisplay from '../ErrorDisplay';
import EventSelect from '../BuiltInFormControls/EventSelect';
import sortTicketTypes from '../TicketTypeAdmin/sortTicketTypes';
import useAsyncFunction from '../useAsyncFunction';
import { useTransformedState, Transforms } from '../ComposableFormUtils';
import useUniqueId from '../useUniqueId';

function TicketForm({
  initialTicket, convention, onSubmit, submitCaption,
}) {
  const [ticketTypeId, setTicketTypeId] = useState((initialTicket.ticket_type || {}).id);
  const [paymentAmount, setPaymentAmount] = useTransformedState(
    initialTicket.payment_amount.fractional / 100.0,
    Transforms.float,
  );
  const [paymentNote, setPaymentNote] = useState(initialTicket.payment_note);
  const [providedByEvent, setProvidedByEvent] = useState(initialTicket.provided_by_event);

  const sortedTicketTypes = useMemo(
    () => sortTicketTypes(convention.ticket_types),
    [convention.ticket_types],
  );
  const paymentAmountInputId = useUniqueId('payment-amount-');
  const eventSelectId = useUniqueId('provided-by-event-');

  const paymentAmountInput = useMemo(
    () => {
      if (paymentAmount == null) {
        return null;
      }
      return {
        fractional: Math.floor(paymentAmount * 100),
        currency_code: 'USD',
      };
    },
    [paymentAmount],
  );

  const ticketInput = useMemo(
    () => ({
      ticket_type_id: Number.parseInt(ticketTypeId, 10),
      payment_amount: paymentAmountInput,
      payment_note: paymentNote,
      provided_by_event_id: (providedByEvent || {}).id,
    }),
    [paymentAmountInput, paymentNote, providedByEvent, ticketTypeId],
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
        <option />
        {sortedTicketTypes.map(({ id, description }) => (
          <option value={id} key={id}>{description}</option>
        ))}
      </BootstrapFormSelect>

      <div className="form-group">
        <label htmlFor={paymentAmountInputId}>
          Payment amount
        </label>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">
              $
            </span>
          </div>
          <input
            id={paymentAmountInputId}
            className="form-control"
            type="number"
            step="0.01"
            value={paymentAmount}
            onChange={(event) => { setPaymentAmount(event.target.value); }}
          />
        </div>
      </div>

      <BootstrapFormInput
        label="Payment note"
        value={paymentNote}
        onTextChange={setPaymentNote}
      />

      <div className="form-group">
        <label htmlFor={eventSelectId}>
          Provided by event (if applicable)
        </label>
        <EventSelect
          inputId={eventSelectId}
          value={providedByEvent}
          onChange={setProvidedByEvent}
        />
      </div>

      <ErrorDisplay graphQLError={submitError} />

      <input
        type="submit"
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
    payment_amount: PropTypes.shape({
      fractional: PropTypes.number.isRequired,
    }).isRequired,
    payment_note: PropTypes.string.isRequired,
    provided_by_event: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitCaption: PropTypes.string.isRequired,
};

export default TicketForm;
