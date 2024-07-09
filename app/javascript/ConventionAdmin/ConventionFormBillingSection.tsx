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
        caption={t('admin.convention.ticketModeLabel', {
          ticketName: convention.ticket_name,
        })}
        choices={[
          {
            value: 'disabled',
            label: t('admin.convention.ticketModeDisabled', {
              ticketNamePlural: convention.ticketNamePlural,
            }),
          },
          {
            value: 'required_for_signup',
            label: t('admin.convention.ticketModeRequiredForSignup', { ticketNamePlural: convention.ticketNamePlural }),
          },
          {
            value: 'ticket_per_event',
            label: t('admin.convention.ticketModeTicketPerEvent', { ticketNamePlural: convention.ticketNamePlural }),
          },
        ]}
        value={convention.ticket_mode}
        onChange={(newValue: string) => {
          setTicketMode(newValue as TicketMode);
        }}
        disabled={disabled}
      />
      <FormGroupWithLabel label={t('admin.convention.defaultCurrency')}>
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
              {t('admin.convention.stripeAccountRequired', { ticketNamePlural: convention.ticketNamePlural })}{' '}
              {convention.stripe_account && (
                <>
                  {convention.stripe_account.charges_enabled ? (
                    <>
                      {t('admin.convention.stripeAccountActive', {
                        conventionName: convention.name,
                        ticketNamePlural: convention.ticketNamePlural,
                      })}
                    </>
                  ) : (
                    <>{t('admin.convention.stripeAccountPending', { conventionName: convention.name })}</>
                  )}
                </>
              )}
            </>
          </p>
          {convention.stripe_account ? (
            <>
              <dl>
                <dt>{t('admin.convention.stripeAccountId')}</dt>
                <dd>{convention.stripe_account.id}</dd>

                <dt>{t('admin.convention.stripeAccountEmail')}</dt>
                <dd>{convention.stripe_account.email}</dd>

                <dt>{t('admin.convention.stripeAccountDisplayName')}</dt>
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
                      t('admin.convention.stripeAccountContinue', { conventionName: convention.name })
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
                  t('admin.convention.stripeAccountSetup', {
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
        label={t('admin.convention.ticketNameLabel')}
        type="text"
        value={convention.ticket_name ?? ''}
        onTextChange={setTicketName}
        disabled={disabled || convention.ticket_mode === 'disabled'}
      />
      <BootstrapFormInput
        name="maximum_tickets"
        label={t('admin.convention.maximumTicketsLabel', {
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
