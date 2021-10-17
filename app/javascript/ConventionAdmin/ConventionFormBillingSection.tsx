import { useCallback } from 'react';
import * as React from 'react';
// @ts-expect-error inflected type definitions don't export capitalize
import { pluralize, capitalize } from 'inflected';
import { ApolloError, useApolloClient } from '@apollo/client';
import {
  BootstrapFormInput,
  MultipleChoiceInput,
  usePropertySetters,
  ErrorDisplay,
  LoadingIndicator,
  parseIntOrNull,
} from '@neinteractiveliterature/litform';

import { useCreateConventionStripeAccountMutation } from './mutations.generated';
import type { ConventionFormConvention } from './ConventionForm';
import { TicketMode } from '../graphqlTypes.generated';
import useAsyncFunction from '../useAsyncFunction';
import {
  StripeAccountOnboardingLinkQueryDocument,
  StripeAccountOnboardingLinkQueryData,
  StripeAccountOnboardingLinkQueryVariables,
} from './queries.generated';

export type ConventionFormBillingSectionProps = {
  convention: ConventionFormConvention;
  setConvention: React.Dispatch<React.SetStateAction<ConventionFormConvention>>;
  disabled: boolean;
};

function ConventionFormBillingSection({
  convention,
  setConvention,
  disabled,
}: ConventionFormBillingSectionProps): JSX.Element {
  const [setTicketName, setMaximumTickets, setTicketMode] = usePropertySetters(
    setConvention,
    'ticket_name',
    'maximum_tickets',
    'ticket_mode',
  );
  const [createConventionStripeAccount] = useCreateConventionStripeAccountMutation();
  const apolloClient = useApolloClient();

  const createStripeAccountAndRedirect = useCallback(async () => {
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
  }, [createConventionStripeAccount]);
  const [startCreateStripeAccount, createStripeAccountError, createStripeAccountInProgress] =
    useAsyncFunction(createStripeAccountAndRedirect);

  const obtainOnboardingLinkAndRedirect = useCallback(async () => {
    const result = await apolloClient.query<
      StripeAccountOnboardingLinkQueryData,
      StripeAccountOnboardingLinkQueryVariables
    >({
      query: StripeAccountOnboardingLinkQueryDocument,
      variables: { baseUrl: window.location.href.toString() },
    });

    const onboardingLink = result.data.convention.stripe_account?.account_onboarding_link;
    if (onboardingLink) {
      window.location.href = onboardingLink;
    }
  }, [apolloClient]);
  const [startObtainOnboardingLink, obtainOnboardingLinkError, obtainOnboardinLinkInProgress] =
    useAsyncFunction(obtainOnboardingLinkAndRedirect);

  return (
    <>
      <MultipleChoiceInput
        caption={`${capitalize(convention.ticket_name)} sales`}
        choices={[
          {
            value: 'disabled',
            label: `Convention does not sell ${pluralize(convention.ticket_name)}`,
          },
          {
            value: 'required_for_signup',
            label: `${pluralize(
              capitalize(convention.ticket_name),
            )} are sold and required for event signups`,
          },
        ]}
        value={convention.ticket_mode}
        onChange={(newValue: string) => {
          setTicketMode(newValue as TicketMode);
        }}
        disabled={disabled}
      />

      <div className="card bg-light mb-3">
        <div className="card-header">Stripe account</div>

        <div className="card-body">
          <p>
            In order to sell {pluralize(convention.ticket_name)} and/or products, a Stripe account
            is required.{' '}
            {convention.stripe_account && (
              <>
                {convention.stripe_account.charges_enabled ? (
                  <>
                    {convention.name} is connected to a Stripe account and is able to sell{' '}
                    {pluralize(convention.ticket_name)} and/or products.
                  </>
                ) : (
                  <>
                    {convention.name} is connected to a Stripe account but that account is still in
                    the setup process.
                  </>
                )}
              </>
            )}
          </p>
          {convention.stripe_account ? (
            <>
              <dl>
                <dt>Account ID</dt>
                <dd>{convention.stripe_account.id}</dd>

                <dt>Email</dt>
                <dd>{convention.stripe_account.email}</dd>

                <dt>Display name</dt>
                <dd>{convention.stripe_account.display_name}</dd>
              </dl>
              {!convention.stripe_account.charges_enabled && (
                <>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={startObtainOnboardingLink}
                    disabled={obtainOnboardinLinkInProgress}
                  >
                    {obtainOnboardinLinkInProgress ? (
                      <LoadingIndicator iconSet="bootstrap-icons" />
                    ) : (
                      `Continue Stripe account setup for ${convention.name}`
                    )}
                  </button>
                  <ErrorDisplay graphQLError={obtainOnboardingLinkError as ApolloError} />
                </>
              )}
            </>
          ) : (
            <>
              <button
                className="btn btn-primary"
                type="button"
                onClick={startCreateStripeAccount}
                disabled={createStripeAccountInProgress}
              >
                {createStripeAccountInProgress ? (
                  <LoadingIndicator iconSet="bootstrap-icons" />
                ) : (
                  `Set up a Stripe account for ${convention.name}`
                )}
              </button>
              <ErrorDisplay graphQLError={createStripeAccountError as ApolloError} />
            </>
          )}
        </div>
      </div>

      <BootstrapFormInput
        name="ticket_name"
        label={'Name for "ticket" at this convention'}
        type="text"
        value={convention.ticket_name ?? ''}
        onTextChange={setTicketName}
        disabled={disabled || convention.ticket_mode === 'disabled'}
      />

      <BootstrapFormInput
        name="maximum_tickets"
        label={`Maximum ${pluralize(convention.ticket_name)}`}
        type="number"
        value={(convention.maximum_tickets ?? '').toString()}
        onTextChange={(newValue) => setMaximumTickets(parseIntOrNull(newValue))}
        disabled={disabled || convention.ticket_mode === 'disabled'}
      />
    </>
  );
}

export default ConventionFormBillingSection;
