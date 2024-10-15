import { Suspense, useMemo, useState, useEffect, useContext, useRef, RefObject } from 'react';
import { useLocation, useNavigate, useLoaderData, Outlet, useNavigation, LoaderFunction } from 'react-router';
import { Settings } from 'luxon';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';

import { AppRootQueryData, AppRootQueryDocument } from './appRootQueries.generated';
import AppRootContext, { AppRootContextValue } from './AppRootContext';
import { timezoneNameForConvention } from './TimeUtils';
import getI18n from './setupI18Next';
import { timespanFromConvention } from './TimespanUtils';
import { LazyStripeContext } from './LazyStripe';
import { Stripe } from '@stripe/stripe-js';
import AuthenticationModalContext from './Authentication/AuthenticationModalContext';
import { GraphQLNotAuthenticatedErrorEvent } from './useIntercodeApolloClient';
import { reloadOnAppEntrypointHeadersMismatch } from './checkAppEntrypointHeadersMatch';
import { initErrorReporting } from 'ErrorReporting';
import RouteErrorBoundary from 'RouteErrorBoundary';
import { buildServerApolloClient } from 'serverApolloClient.server';
import * as Route from './+types.AppRoot';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = buildServerApolloClient(request);
  const { data } = await client.query({ query: AppRootQueryDocument });
  return data;
};

export const errorElement = RouteErrorBoundary;

export function buildAppRootContextValue(
  data: AppRootQueryData,
  navigationBarRef: RefObject<HTMLElement>,
): AppRootContextValue {
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
    navigationBarRef,
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

function AppRoot({ loaderData: data }: Route.ComponentProps): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const authenticationModal = useContext(AuthenticationModalContext);
  const navigation = useNavigation();
  const navigationBarRef = useRef<HTMLElement>(null);

  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    initErrorReporting(data.currentUser?.id);
  }, [data?.currentUser?.id]);

  useEffect(() => {
    reloadOnAppEntrypointHeadersMismatch();
  }, [location.pathname]);

  const appRootContextValue = useMemo(() => buildAppRootContextValue(data, navigationBarRef), [data]);

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
        <div className={navigation.state === 'idle' ? '' : 'cursor-wait'}>
          <div
            className="position-fixed d-flex flex-column justify-content-center"
            style={{ zIndex: 1050, width: '100vw', height: '100vh', top: 0, left: 0, pointerEvents: 'none' }}
          >
            <PageLoadingIndicator visible={navigation.state === 'loading'} />
          </div>
          {/* Disabling ScrollRestoration for now because it's breaking hash links within the same page (reproducible with Mac Chrome) */}
          {/* <ScrollRestoration /> */}
          <Suspense fallback={<PageLoadingIndicator visible iconSet="bootstrap-icons" />}>
            <Outlet />
          </Suspense>
        </div>
      </LazyStripeContext.Provider>
    </AppRootContext.Provider>
  );
}

export default AppRoot;
