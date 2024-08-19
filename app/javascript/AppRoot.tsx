import { Suspense, useMemo, useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useLoaderData, Outlet, ScrollRestoration } from 'react-router-dom';
import { Settings } from 'luxon';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';

import { AppRootQueryData } from './appRootQueries.generated';
import AppRootContext, { AppRootContextValue } from './AppRootContext';
import { timezoneNameForConvention } from './TimeUtils';
import getI18n from './setupI18Next';
import { timespanFromConvention } from './TimespanUtils';
import { LazyStripeContext } from './LazyStripe';
import { Stripe } from '@stripe/stripe-js';
import AuthenticationModalContext from './Authentication/AuthenticationModalContext';
import { GraphQLNotAuthenticatedErrorEvent } from './useIntercodeApolloClient';

export function buildAppRootContextValue(data: AppRootQueryData): AppRootContextValue {
  return {
    assumedIdentityFromProfile: data.assumedIdentityFromProfile,
    cmsNavigationItems: data.cmsParentByRequestHost.cmsNavigationItems,
    convention: data.convention,
    conventionAcceptingProposals: data.convention?.accepting_proposals,
    conventionCanceled: data.convention?.canceled,
    conventionName: data.convention?.name,
    conventionDomain: data.convention?.domain,
    conventionTimespan: data?.convention ? timespanFromConvention(data.convention) : undefined,
    currentAbility: data.currentAbility,
    currentPendingOrder: data.convention?.my_profile?.current_pending_order,
    currentUser: data.currentUser,
    defaultCurrencyCode: data.convention?.default_currency_code ?? data.defaultCurrencyCode,
    hasOAuthApplications: data.hasOauthApplications,
    // eslint-disable-next-line i18next/no-literal-string
    language: data.convention?.language ?? 'en',
    myProfile: data.convention?.my_profile,
    rootSiteName: data.rootSite?.site_name,
    siteMode: data.convention?.site_mode,
    signupMode: data.convention?.signup_mode,
    supportedCurrencyCodes: data.supportedCurrencyCodes,
    signupAutomationMode: data.convention?.signup_automation_mode,
    ticketMode: data.convention?.ticket_mode,
    ticketName: data.convention?.ticket_name,
    ticketNamePlural: data.convention?.ticketNamePlural,
    ticketTypes: data.convention?.ticket_types,
    ticketsAvailableForPurchase: data.convention?.tickets_available_for_purchase,
    timezoneName: timezoneNameForConvention(data.convention),
  };
}

function AppRoot(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const data = useLoaderData() as AppRootQueryData;
  const authenticationModal = useContext(AuthenticationModalContext);

  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    if (typeof Rollbar !== 'undefined') {
      Rollbar.configure({
        payload: {
          person: {
            id: data?.currentUser?.id,
          },
        },
      });
    }
  }, [data?.currentUser?.id]);

  const appRootContextValue = useMemo(() => buildAppRootContextValue(data), [data]);

  useEffect(() => {
    if (
      data.convention?.my_profile &&
      (data.convention.clickwrap_agreement || '').trim() !== '' &&
      !data.convention.my_profile.accepted_clickwrap_agreement &&
      location.pathname !== '/clickwrap_agreement' &&
      location.pathname !== '/' &&
      !location.pathname.startsWith('/pages')
    ) {
      navigate('/clickwrap_agreement', { replace: true });
    }
  }, [data, navigate, location]);

  useEffect(() => {
    if (appRootContextValue?.language) {
      getI18n().then((i18n) => {
        i18n.changeLanguage(appRootContextValue.language);
        Settings.defaultLocale = appRootContextValue.language;
      });
    }
  }, [appRootContextValue]);

  useEffect(() => {
    const unauthenticatedHandler = () => {
      if (!authenticationModal.visible) {
        authenticationModal.open({ currentView: 'signIn' });
        authenticationModal.setAfterSignInPath(location.pathname);
      }
    };

    window.addEventListener(GraphQLNotAuthenticatedErrorEvent.type, unauthenticatedHandler);

    return () => {
      window.removeEventListener(GraphQLNotAuthenticatedErrorEvent.type, unauthenticatedHandler);
    };
  }, [authenticationModal, location.pathname]);

  return (
    <AppRootContext.Provider value={appRootContextValue}>
      <LazyStripeContext.Provider
        value={{
          publishableKey: data?.convention?.stripe_publishable_key ?? undefined,
          accountId: data?.convention?.stripe_account_id ?? undefined,
          stripePromise,
          setStripePromise,
        }}
      >
        <ScrollRestoration />
        <Suspense fallback={<PageLoadingIndicator visible iconSet="bootstrap-icons" />}>
          <Outlet />
        </Suspense>
      </LazyStripeContext.Provider>
    </AppRootContext.Provider>
  );
}

export default AppRoot;
