import { useCallback } from 'react';
import * as React from 'react';
import { ApolloError, useApolloClient } from '@apollo/client';
import {
  BootstrapFormInput,
  MultipleChoiceInput,
  usePropertySetters,
  ErrorDisplay,
  LoadingIndicator,
  parseIntOrNull,
  FormGroupWithLabel,
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
import { useTranslation } from 'react-i18next';
import CurrencySelect from '../Store/CurrencySelect';

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
  const [setTicketName, setMaximumTickets, setTicketMode, setDefaultCurrencyCode] = usePropertySetters(
    setConvention,
    'ticket_name',
    'maximum_tickets',
    'ticket_mode',
    'default_currency_code',
  );
  const [createConventionStripeAccount] = useCreateConventionStripeAccountMutation();
  const apolloClient = useApolloClient();
  const { t } = useTranslation();

  const createStripeAccountAndRedirect = useCallback(async () => {
    const result = await createConventionStripeAccount({
      variables: {
        baseUrl: window.location.href.toString(),
      },
    });
    const onboardingLink = result.data?.createConventionStripeAccount?.stripe_account.account_onboarding_link;
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
  const [startObtainOnboardingLink, obtainOnboardingLinkError, obtainOnboardinLinkInProgress] = useAsyncFunction(
    obtainOnboardingLinkAndRedirect,
  );

  return (
    <>
      <MultipleChoiceInput
        caption={t('admin.convention.ticketModeLabel', '{{ ticketName, capitalize }} sales', {
          ticketName: convention.ticket_name,
        })}
        choices={[
          {
            value: 'disabled',
            label: t('admin.convention.ticketModeDisabled', 'Convention does not sell {{ ticketNamePlural }}', {
              ticketNamePlural: convention.ticketNamePlural,
            }),
          },
          {
            value: 'required_for_signup',
            label: t(
              'admin.convention.ticketModeRequiredForSignup',
              '{{ ticketNamePlural, capitalize }} are sold and required for event signups',
              { ticketNamePlural: convention.ticketNamePlural },
            ),
          },
          {
            value: 'ticket_per_event',
            label: t(
              'admin.convention.ticketModeTicketPerEvent',
              'Each event in this convention sells {{ ticketNamePlural }} separately',
              { ticketNamePlural: convention.ticketNamePlural },
            ),
          },
        ]}
        value={convention.ticket_mode}
        onChange={(newValue: string) => {
          setTicketMode(newValue as TicketMode);
        }}
        disabled={disabled}
      />

      <FormGroupWithLabel label={t('admin.convention.defaultCurrency', 'Default currency for convention')}>
        {(id) => (
          <CurrencySelect
            id={id}
            className="form-select"
            value={convention.default_currency_code ?? undefined}
            onChange={setDefaultCurrencyCode}
          />
        )}
      </FormGroupWithLabel>

      <div className="card bg-light mb-3">
        <div className="card-header">Stripe account</div>

        <div className="card-body">
          <p>
            <>
              {t(
                'admin.convention.stripeAccountRequired',
                'In order to sell {{ ticketNamePlural }} and/or products, a Stripe account is required.',
                { ticketNamePlural: convention.ticketNamePlural },
              )}{' '}
              {convention.stripe_account && (
                <>
                  {convention.stripe_account.charges_enabled ? (
                    <>
                      {t(
                        'admin.convention.stripeAccountActive',
                        '{{ conventionName }} is connected to a Stripe account and is able to sell {{ ticketNamePlural }} and/or products.',
                        { conventionName: convention.name, ticketNamePlural: convention.ticketNamePlural },
                      )}
                    </>
                  ) : (
                    <>
                      {t(
                        'admin.convention.stripeAccountPending',
                        '{{ conventionName }} is connected to a Stripe account but that account is still in the setup process.',
                        { conventionName: convention.name },
                      )}
                    </>
                  )}
                </>
              )}
            </>
          </p>
          {convention.stripe_account ? (
            <>
              <dl>
                <dt>{t('admin.convention.stripeAccountId', 'Account ID')}</dt>
                <dd>{convention.stripe_account.id}</dd>

                <dt>{t('admin.convention.stripeAccountEmail', 'Email')}</dt>
                <dd>{convention.stripe_account.email}</dd>

                <dt>{t('admin.convention.stripeAccountDisplayName', 'Display name')}</dt>
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
                      t(
                        'admin.convention.stripeAccountContinue',
                        'Continue Stripe account setup for {{ conventionName }}',
                        { conventionName: convention.name },
                      )
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
                  t('admin.convention.stripeAccountSetup', 'Set up a Stripe account for {{ conventionName }}', {
                    conventionName: convention.name,
                  })
                )}
              </button>
              <ErrorDisplay graphQLError={createStripeAccountError as ApolloError} />
            </>
          )}
        </div>
      </div>

      <BootstrapFormInput
        name="ticket_name"
        label={t('admin.convention.ticketNameLabel', 'Name for “ticket” at this convention')}
        type="text"
        value={convention.ticket_name ?? ''}
        onTextChange={setTicketName}
        disabled={disabled || convention.ticket_mode === 'disabled'}
      />

      <BootstrapFormInput
        name="maximum_tickets"
        label={t('admin.convention.maximumTicketsLabel', 'Maximum {{ ticketNamePlural }}', {
          ticketNamePlural: convention.ticketNamePlural,
        })}
        type="number"
        value={(convention.maximum_tickets ?? '').toString()}
        onTextChange={(newValue) => setMaximumTickets(parseIntOrNull(newValue))}
        disabled={disabled || convention.ticket_mode === 'disabled'}
      />
    </>
  );
}

export default ConventionFormBillingSection;
