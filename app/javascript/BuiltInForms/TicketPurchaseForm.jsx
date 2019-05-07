import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { CardElement, injectStripe } from 'react-stripe-elements';

import ErrorDisplay from '../ErrorDisplay';
import formatMoney from '../formatMoney';
import { LazyStripeElementsWrapper } from '../LazyStripe';
import { PurchaseTicket } from './ticketPurchaseFormMutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import PoweredByStripeLogo from '../images/powered_by_stripe.svg';
import LoadingIndicator from '../LoadingIndicator';
import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import useMutationCallback from '../useMutationCallback';

function TicketPurchaseForm({
  ticketTypes, purchaseCompleteUrl, initialTicketTypeId, initialName, stripe,
}) {
  const [ticketTypeId, setTicketTypeId] = useState((initialTicketTypeId || '').toString());
  const [name, setName] = useState(initialName);
  const [ticket, setTicket] = useState(null);
  const purchaseTicket = useMutationCallback(PurchaseTicket);

  const [submitPayment, error, submitting] = useAsyncFunction(useCallback(
    async () => {
      const { token, error: stripeError } = await stripe.createToken({ name });

      if (stripeError) {
        throw stripeError;
      }

      const purchaseResponse = await purchaseTicket({
        variables: {
          ticketTypeId: Number.parseInt(ticketTypeId, 10),
          stripeToken: token.id,
        },
      });
      setTicket(purchaseResponse.data.purchaseTicket.ticket);
    },
    [purchaseTicket, ticketTypeId, name, stripe],
  ));

  const purchaseAcknowledged = useCallback(
    () => { window.location.href = purchaseCompleteUrl; },
    [purchaseCompleteUrl],
  );

  const disabled = (!ticketTypeId || submitting);

  const renderTicketTypeSelect = () => {
    const choices = ticketTypes.map((ticketType) => {
      let label = `${ticketType.name} (${ticketType.formattedPrice})`;
      if (!ticketType.available) {
        label += ' - SOLD OUT';
      }

      return {
        label,
        value: ticketType.id.toString(),
        disabled: !ticketType.available,
      };
    });

    return <ChoiceSet choices={choices} value={ticketTypeId} onChange={setTicketTypeId} />;
  };

  const renderPaymentSection = () => (
    <div>
      <hr />
      <ErrorDisplay graphQLError={error} />

      <BootstrapFormInput
        name="name"
        label="Name"
        value={name}
        onTextChange={setName}
      />

      <div>
        <CardElement
          className="form-control mb-4"
          disabled={disabled || submitting}
          style={{
            base: {
              lineHeight: 1.5,
              fontSize: '16px',
            },
          }}
        />

        <div className="d-flex justify-content-end align-items-center">
          <img src={PoweredByStripeLogo} alt="Powered by Stripe" className="mr-4" />
          <button
            className="btn btn-primary"
            onClick={submitPayment}
            disabled={disabled}
            type="submit"
          >
            {submitting ? <LoadingIndicator /> : 'Submit payment'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderTicketTypeSelect()}
      {renderPaymentSection()}
      <Modal visible={ticket != null}>
        <div className="modal-header"><h3>Thank you!</h3></div>
        <div className="modal-body">
          {
            ticket
              ? (
                <div>
                  Your purchase of a
                  {' '}
                  {ticket.ticket_type.description}
                  {' '}
                  for
                  {' '}
                  {formatMoney(ticket.payment_amount)}
                  {' '}
                  was successful.  We&apos;ve emailed you a receipt.
                </div>
              )
              : null
          }
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={purchaseAcknowledged} type="button">
            OK
          </button>
        </div>
      </Modal>
    </>
  );
}

TicketPurchaseForm.propTypes = {
  ticketTypes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    formattedPrice: PropTypes.string.isRequired,
    available: PropTypes.bool.isRequired,
  })).isRequired,
  purchaseCompleteUrl: PropTypes.string.isRequired,
  initialTicketTypeId: PropTypes.number,
  initialName: PropTypes.string,
  stripe: PropTypes.shape({
    createToken: PropTypes.func.isRequired,
  }).isRequired,
};

TicketPurchaseForm.defaultProps = {
  initialTicketTypeId: null,
  initialName: '',
};

export default LazyStripeElementsWrapper(injectStripe(TicketPurchaseForm));
