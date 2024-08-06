import { Suspense, useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate, useLoaderData, Outlet } from 'react-router-dom';
import { Settings } from 'luxon';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import {
  AppRootQueryData,
  AppRootQueryVariables,
  useAppRootLayoutQuerySuspenseQuery,
} from './appRootQueries.generated';
import AppRouter from './AppRouter';
import AppRootContext, { AppRootContextValue } from './AppRootContext';
import parseCmsContent, { CMS_COMPONENT_MAP } from './parseCmsContent';
import { timezoneNameForConvention } from './TimeUtils';
import getI18n from './setupI18Next';
import { lazyWithAppEntrypointHeadersCheck } from './checkAppEntrypointHeadersMatch';
import { timespanFromConvention } from './TimespanUtils';
import { LazyStripeContext } from './LazyStripe';
import { Stripe } from '@stripe/stripe-js';
import { Helmet } from 'react-helmet-async';
import React from 'react';
import { ScriptTag } from './parsePageContent';
import { QueryRef, useReadQuery } from '@apollo/client';

const NavigationBar = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: 'navigation-bar' */ './NavigationBar'),
);

// Avoid unnecessary layout checks when moving between pages that can't change layout
function normalizePathForLayout(path: string) {
  if (path.startsWith('/pages/') || path === '/') {
    return path;
  }

  // only event ID is relevant for layout rendering
  const eventsMatch = path.match(/^\/events\/(\d+)/);
  if (eventsMatch) {
    // eslint-disable-next-line i18next/no-literal-string
    return `/events/${eventsMatch[1]}`;
  }

  // eslint-disable-next-line i18next/no-literal-string
  return '/non_cms_path'; // arbitrary path that's not a CMS page
}

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

export function AppRootLayoutContent() {
  const location = useLocation();
  const [cachedCmsLayoutId, setCachedCmsLayoutId] = useState<string>();
  const [layoutChanged, setLayoutChanged] = useState(false);

  const { data, error } = useAppRootLayoutQuerySuspenseQuery({
    variables: { path: normalizePathForLayout(location.pathname) },
  });

  const parsedCmsContent = useMemo(() => {
    if (error) {
      return null;
    }

    return parseCmsContent(data.cmsParentByRequestHost.effectiveCmsLayout.content_html ?? '', {
      ...CMS_COMPONENT_MAP,
      AppRouter,
      NavigationBar,
    });
  }, [data.cmsParentByRequestHost.effectiveCmsLayout.content_html, error]);

  const [headComponentsWithoutScriptTags, headScriptTags] = useMemo(() => {
    if (parsedCmsContent?.headComponents == null) {
      return [[], []];
    }

    const nonScriptTags: React.ReactNode[] = [];
    const scriptTags: React.ReactNode[] = [];

    React.Children.forEach(parsedCmsContent.headComponents, (child) => {
      if (React.isValidElement(child) && child.type === ScriptTag) {
        scriptTags.push(child);
      } else {
        nonScriptTags.push(child);
      }
    });

    return [nonScriptTags, scriptTags];
  }, [parsedCmsContent?.headComponents]);

  useEffect(() => {
    if (!error && data && cachedCmsLayoutId !== data.cmsParentByRequestHost.effectiveCmsLayout.id) {
      if (cachedCmsLayoutId) {
        // if the layout changed we need a full page reload to rerender the <head>
        setLayoutChanged(true);
        window.location.reload();
      } else {
        setCachedCmsLayoutId(data.cmsParentByRequestHost.effectiveCmsLayout.id);
      }
    }
  }, [error, cachedCmsLayoutId, data]);

  if (layoutChanged) {
    return <></>;
  }

  if (!parsedCmsContent?.bodyComponents) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  return (
    <>
      <Helmet>{headComponentsWithoutScriptTags}</Helmet>
      {headScriptTags}
      {parsedCmsContent?.bodyComponents}
    </>
  );
}

function AppRoot(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const queryRef = useLoaderData() as QueryRef<AppRootQueryData, AppRootQueryVariables>;
  const { data, error } = useReadQuery(queryRef);

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

  const appRootContextValue = useMemo(() => (data ? buildAppRootContextValue(data) : undefined), [data]);

  useEffect(() => {
    if (
      !error &&
      data?.convention?.my_profile &&
      (data.convention.clickwrap_agreement || '').trim() !== '' &&
      !data.convention.my_profile.accepted_clickwrap_agreement &&
      location.pathname !== '/clickwrap_agreement' &&
      location.pathname !== '/' &&
      !location.pathname.startsWith('/pages')
    ) {
      navigate('/clickwrap_agreement', { replace: true });
    }
  }, [data, error, navigate, location]);

  useEffect(() => {
    if (appRootContextValue?.language) {
      getI18n().then((i18n) => {
        i18n.changeLanguage(appRootContextValue.language);
        Settings.defaultLocale = appRootContextValue.language;
      });
    }
  }, [appRootContextValue]);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!appRootContextValue) {
    // we need to wait a render cycle for useCachedLoadableValue to do its thing
    return <></>;
  }

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
        <Suspense fallback={<PageLoadingIndicator visible iconSet="bootstrap-icons" />}>
          <Outlet />
        </Suspense>
      </LazyStripeContext.Provider>
    </AppRootContext.Provider>
  );
}

export default AppRoot;
