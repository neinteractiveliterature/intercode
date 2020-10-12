import React from 'react';
// @ts-expect-error
import { pluralize, capitalize } from 'inflected';

import { Transforms } from '../ComposableFormUtils';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import { useCreateConventionStripeAccountMutation } from './mutations.generated';
import type { ConventionFormConvention } from './ConventionForm';
import { usePartialState, usePartialStateFactory } from '../usePartialState';
import { TicketMode } from '../graphqlTypes.generated';

export type ConventionFormBillingSectionProps = {
  convention: ConventionFormConvention;
  setConvention: React.Dispatch<React.SetStateAction<ConventionFormConvention>>;
  disabled: boolean;
};

function ConventionFormBillingSection({
  convention,
  setConvention,
  disabled,
}: ConventionFormBillingSectionProps) {
  const factory = usePartialStateFactory(convention, setConvention);
  const [ticketName, setTicketName] = usePartialState(factory, 'ticket_name');
  const [maximumTickets, setMaximumTickets] = usePartialState(factory, 'maximum_tickets');
  const [ticketMode, setTicketMode] = usePartialState(factory, 'ticket_mode');
  const [createConventionStripeAccount] = useCreateConventionStripeAccountMutation();

  const createStripeAccount = async () => {
    const result = await createConventionStripeAccount({
      variables: {
        baseUrl: window.location.href.toString(),
      },
    });
    const onboardingLink =
      result.data?.createConventionStripeAccount?.stripe_account.account_onboarding_link;
    if (onboardingLink) {
      window.location.href = onboardingLink;
    }
  };

  return (
    <>
      <MultipleChoiceInput
        caption={`${capitalize(ticketName)} sales`}
        choices={[
          {
            value: 'disabled',
            label: `Convention does not sell ${pluralize(ticketName)}`,
          },
          {
            value: 'required_for_signup',
            label: `${pluralize(capitalize(ticketName))} are sold and required for event signups`,
          },
        ]}
        value={ticketMode}
        onChange={(newValue: string) => {
          setTicketMode(newValue as TicketMode);
        }}
        disabled={disabled}
      />

      {ticketMode !== 'disabled' && (
        <div className="card bg-light mb-3">
          <div className="card-header">Stripe account</div>

          <div className="card-body">
            <p>
              In order to sell {pluralize(ticketName)}, a Stripe account is required.
              {convention.stripe_account && (
                <>
                  {convention.stripe_account.charges_enabled ? (
                    <>
                      {convention.name} is connected to a Stripe account and is able to sell
                      {pluralize(ticketName)}.
                    </>
                  ) : (
                    <>
                      {convention.name} is connected to a Stripe account but that account is still
                      in the setup process.
                    </>
                  )}
                </>
              )}
            </p>
            {convention.stripe_account ? (
              <dl>
                <dt>Account ID</dt>
                <dd>{convention.stripe_account.id}</dd>

                <dt>Email</dt>
                <dd>{convention.stripe_account.email}</dd>

                <dt>Display name</dt>
                <dd>{convention.stripe_account.display_name}</dd>
              </dl>
            ) : (
              <button className="btn btn-primary" type="button" onClick={createStripeAccount}>
                Set up a Stripe account for {convention.name}
              </button>
            )}
          </div>
        </div>
      )}

      <BootstrapFormInput
        name="ticket_name"
        label={'Name for "ticket" at this convention'}
        type="text"
        value={ticketName ?? ''}
        onTextChange={setTicketName}
        disabled={disabled || convention.ticket_mode === 'disabled'}
      />

      <BootstrapFormInput
        name="maximum_tickets"
        label={`Maximum ${pluralize(ticketName)}`}
        type="number"
        value={(maximumTickets ?? '').toString()}
        onTextChange={(newValue) => setMaximumTickets(Transforms.integer(newValue))}
        disabled={disabled || convention.ticket_mode === 'disabled'}
      />
    </>
  );
}

export default ConventionFormBillingSection;
