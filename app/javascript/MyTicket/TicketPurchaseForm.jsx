import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { CardElement, injectStripe } from 'react-stripe-elements';
import classNames from 'classnames';
import { Redirect } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import ErrorDisplay from '../ErrorDisplay';
import formatMoney from '../formatMoney';
import { LazyStripeElementsWrapper } from '../LazyStripe';
import LoadingIndicator from '../LoadingIndicator';
import PoweredByStripeLogo from '../images/powered_by_stripe.svg';
import { PurchaseTicket } from './mutations.gql';
import { TicketPurchaseFormQuery } from './queries.gql';
import useAsyncFunction from '../useAsyncFunction';
import { findCurrentValue } from '../ScheduledValueUtils';
import Checkmark from '../EventsApp/TeamMemberAdmin/Checkmark';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import PageLoadingIndicator from '../PageLoadingIndicator';

function TicketPurchaseForm({ stripe }) {
  const { data, loading, error: queryError } = useQuery(TicketPurchaseFormQuery);
  const availableTicketTypes = (queryError || loading
    ? []
    : data.convention.ticket_types.filter((ticketType) => ticketType.publicly_available));
  const [ticketType, setTicketType] = useState(null);
  const [name, setName] = useState(((data || {}).myProfile || {}).name_without_nickname || '');
  const [ticket, setTicket] = useState(null);
  const [purchaseTicket] = useMutation(PurchaseTicket);

  useEffect(
    () => {
      if (!loading) {
        if (availableTicketTypes.length === 1) {
          setTicketType(availableTicketTypes[0]);
        }
      }
    },
    [availableTicketTypes, loading],
  );

  const [submitPayment, error, submitting] = useAsyncFunction(useCallback(
    async () => {
      const { token, error: stripeError } = await stripe.createToken({ name });

      if (stripeError) {
        throw stripeError;
      }

      const purchaseResponse = await purchaseTicket({
        variables: {
          ticketTypeId: ticketType.id,
          stripeToken: token.id,
        },
      });
      setTicket(purchaseResponse.data.purchaseTicket.ticket);
    },
    [purchaseTicket, ticketType, name, stripe],
  ));

  usePageTitle(useValueUnless(() => `Buy a ${data.convention.ticket_name}`, queryError || loading));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (queryError) {
    return <ErrorDisplay graphQLError={queryError} />;
  }

  if (data.myProfile && data.myProfile.ticket) {
    return <Redirect to="/" />;
  }

  const disabled = (!ticketType || submitting);

  const renderTicketTypeSelect = () => (
    <div className="d-flex">
      {availableTicketTypes.map((type) => {
        const { pricing_schedule: pricingSchedule, id, description } = type;
        const currentPrice = findCurrentValue(pricingSchedule);
        return (
          <button
            className={classNames(
              'btn text-left',
              {
                'btn-outline-primary': (ticketType || {}).id !== id,
                'btn-primary': (ticketType || {}).id === id,
              },
            )}
            type="button"
            onClick={() => { setTicketType(type); }}
          >
            <div className="d-flex align-items-center">
              <div>
                <strong>{description}</strong>
                <br />
                {formatMoney(currentPrice)}
              </div>
              <Checkmark value={(ticketType || {}).id === id} className="ml-2" />
            </div>
          </button>
        );
      })}
    </div>
  );

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
            {`Buy ${data.convention.ticket_name} for `}
            {formatMoney(findCurrentValue(ticketType.pricing_schedule))}
            {submitting && (
              <>
                {' '}
                <LoadingIndicator />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <h1 className="mb-4">
        Buy a
        {' '}
        {data.convention.ticket_name}
        {' '}
        for
        {' '}
        {data.convention.name}
      </h1>
      {renderTicketTypeSelect()}
      {ticketType && renderPaymentSection()}
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
          <a className="btn btn-primary" href="/">OK</a>
        </div>
      </Modal>
    </>
  );
}

TicketPurchaseForm.propTypes = {
  stripe: PropTypes.shape({
    createToken: PropTypes.func.isRequired,
  }).isRequired,
};

export default LazyStripeElementsWrapper(injectStripe(TicketPurchaseForm));
