import { Suspense, useMemo, useState, useEffect, useRef } from 'react';
import { useLocation, useLoaderData, Outlet, useNavigation } from 'react-router';
import { Settings } from 'luxon';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';

import { AppRootQueryData } from './appRootQueries.generated';
import AppRootContext, { AppRootContextValue } from './AppRootContext';
import { timezoneNameForConvention } from './TimeUtils';
import getI18n from './setupI18Next';
import { timespanFromConvention } from './TimespanUtils';
import { LazyStripeContext } from './LazyStripe';
import { Stripe } from '@stripe/stripe-js';
import { reloadOnAppEntrypointHeadersMismatch } from './checkAppEntrypointHeadersMatch';
import errorReporting from 'ErrorReporting';

export function buildAppRootContextValue(
  data: AppRootQueryData | null | undefined,
): Omit<AppRootContextValue, 'navigationBarRef'> {
  return {
    assumedIdentityFromProfile: data?.assumedIdentityFromProfile,
    cmsNavigationItems: data?.cmsParentByRequestHost.cmsNavigationItems ?? [],
    convention: data?.convention ?? null,
    conventionAcceptingProposals: data?.convention?.accepting_proposals,
    conventionCanceled: data?.convention?.canceled,
    conventionName: data?.convention?.name,
    conventionDomain: data?.convention?.domain,
    conventionTimespan: data?.convention ? timespanFromConvention(data.convention) : undefined,
    currentAbility: data?.currentAbility ?? {
      __typename: 'Ability',
      can_list_events: false,
      can_manage_any_cms_content: false,
      can_manage_conventions: false,
      can_manage_email_routes: false,
      can_manage_forms: false,
      can_manage_oauth_applications: false,
      can_manage_rooms: false,
      can_manage_runs: false,
      can_manage_signups: false,
      can_manage_staff_positions: false,
      can_manage_ticket_types: false,
      can_read_any_mailing_list: false,
      can_read_event_proposals: false,
      can_read_orders: false,
      can_read_organizations: false,
      can_read_reports: false,
      can_read_schedule: false,
      can_read_schedule_with_counts: false,
      can_read_user_activity_alerts: false,
      can_read_user_con_profiles: false,
      can_read_users: false,
      can_update_convention: false,
      can_update_departments: false,
      can_update_event_categories: false,
      can_update_notification_templates: false,
    },
    currentPendingOrder: data?.convention?.my_profile?.current_pending_order,
    currentUser: data?.currentUser,
    defaultCurrencyCode: data?.convention?.default_currency_code ?? data?.defaultCurrencyCode ?? 'USD',
    hasOAuthApplications: data?.hasOauthApplications ?? false,
    // eslint-disable-next-line i18next/no-literal-string
    language: data?.convention?.language ?? 'en',
    myProfile: data?.convention?.my_profile,
    rootSiteName: data?.rootSite?.site_name,
    siteMode: data?.convention?.site_mode,
    signupMode: data?.convention?.signup_mode,
    supportedCurrencyCodes: data?.supportedCurrencyCodes ?? ['USD'],
    signupAutomationMode: data?.convention?.signup_automation_mode,
    ticketMode: data?.convention?.ticket_mode,
    ticketName: data?.convention?.ticket_name,
    ticketNamePlural: data?.convention?.ticketNamePlural,
    ticketTypes: data?.convention?.ticket_types,
    ticketsAvailableForPurchase: data?.convention?.tickets_available_for_purchase,
    timezoneName: timezoneNameForConvention(data?.convention),
  };
}

function AppRoot(): React.JSX.Element {
  const location = useLocation();
  const data = useLoaderData() as AppRootQueryData;
  const navigation = useNavigation();
  const navigationBarRef = useRef<HTMLElement>(null);

  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    // Error reporting is initialized in the boot sequence (see packs/application.tsx);
    // here we just associate subsequent reports with the signed-in user.
    errorReporting().setCurrentUser(data.currentUser?.id);
  }, [data?.currentUser?.id]);

  useEffect(() => {
    reloadOnAppEntrypointHeadersMismatch();
  }, [location.pathname]);

  const appRootContextValue = useMemo(
    () => ({ ...buildAppRootContextValue(data), navigationBarRef }),
    [data, navigationBarRef],
  );

  useEffect(() => {
    if (appRootContextValue?.language) {
      getI18n().then((i18n) => {
        i18n.changeLanguage(appRootContextValue.language);
        Settings.defaultLocale = appRootContextValue.language;
      });
    }
  }, [appRootContextValue]);

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
