import { Suspense, useMemo, useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Settings } from 'luxon';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import { useAppRootQuery } from './appRootQueries.generated';
import AppRouter from './AppRouter';
import AppRootContext from './AppRootContext';
import useCachedLoadableValue from './useCachedLoadableValue';
import PageComponents from './PageComponents';
import parseCmsContent, { CMS_COMPONENT_MAP } from './parseCmsContent';
import { timezoneNameForConvention } from './TimeUtils';
import getI18n from './setupI18Next';
import { lazyWithBundleHashCheck } from './checkBundleHash';
import { timespanFromConvention } from './TimespanUtils';

const NavigationBar = lazyWithBundleHashCheck(() => import(/* webpackChunkName: 'navigation-bar' */ './NavigationBar'));

// Avoid unnecessary layout checks when moving between pages that can't change layout
function normalizePathForLayout(path: string) {
  if (path.startsWith('/pages/') || path === '/') {
    return path;
  }

  // only event ID is relevant for layout rendering
  const eventsMatch = path.match(/^\/events\/(\d+)/);
  if (eventsMatch) {
    return `/events/${eventsMatch[1]}`;
  }

  return '/non_cms_path'; // arbitrary path that's not a CMS page
}

function AppRoot(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, loading, error } = useAppRootQuery({
    variables: { path: normalizePathForLayout(location.pathname) },
  });

  const [cachedCmsLayoutId, setCachedCmsLayoutId] = useState<string>();
  const [layoutChanged, setLayoutChanged] = useState(false);

  const bodyComponents = useMemo(() => {
    if (error || loading || !data) {
      return null;
    }

    return parseCmsContent(data.cmsParentByRequestHost.effectiveCmsLayout.content_html ?? '', {
      ...CMS_COMPONENT_MAP,
      AppRouter,
      NavigationBar,
    }).bodyComponents;
  }, [data, error, loading]);

  const cachedBodyComponents = useCachedLoadableValue(loading, error, () => bodyComponents, [bodyComponents]);
  const appRootContextValue = useCachedLoadableValue(
    loading,
    error,
    () =>
      data
        ? {
            assumedIdentityFromProfile: data.assumedIdentityFromProfile,
            cmsNavigationItems: data.cmsParentByRequestHost.cmsNavigationItems,
            conventionAcceptingProposals: data.convention?.accepting_proposals,
            conventionCanceled: data.convention?.canceled,
            conventionName: data.convention?.name,
            conventionDomain: data.convention?.domain,
            conventionTimespan: data?.convention ? timespanFromConvention(data.convention) : undefined,
            currentAbility: data.currentAbility,
            currentPendingOrder: data.convention?.my_profile?.current_pending_order,
            currentUser: data.currentUser,
            language: data.convention?.language ?? 'en',
            myProfile: data.convention?.my_profile,
            rootSiteName: data.rootSite?.site_name,
            siteMode: data.convention?.site_mode,
            signupMode: data.convention?.signup_mode,
            ticketMode: data.convention?.ticket_mode,
            ticketName: data.convention?.ticket_name,
            ticketTypes: data.convention?.ticket_types,
            ticketsAvailableForPurchase: data.convention?.tickets_available_for_purchase,
            timezoneName: timezoneNameForConvention(data.convention),
          }
        : undefined,
    [data],
  );

  useEffect(() => {
    if (!loading && !error && data && cachedCmsLayoutId !== data.cmsParentByRequestHost.effectiveCmsLayout.id) {
      if (cachedCmsLayoutId) {
        // if the layout changed we need a full page reload to rerender the <head>
        setLayoutChanged(true);
        window.location.reload();
      } else {
        setCachedCmsLayoutId(data.cmsParentByRequestHost.effectiveCmsLayout.id);
      }
    }
  }, [loading, error, cachedCmsLayoutId, data]);

  useEffect(() => {
    if (
      !loading &&
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
  }, [data, error, navigate, loading, location]);

  useEffect(() => {
    if (appRootContextValue?.language) {
      getI18n().then((i18n) => {
        i18n.changeLanguage(appRootContextValue.language);
        Settings.defaultLocale = appRootContextValue.language;
      });
    }
  }, [appRootContextValue]);

  if (layoutChanged) {
    return <></>;
  }

  if (loading && !cachedBodyComponents) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!appRootContextValue) {
    // we need to wait a render cycle for useCachedLoadableValue to do its thing
    return <></>;
  }

  return (
    <AppRootContext.Provider value={appRootContextValue}>
      <Routes>
        <Route path="/admin_forms/:id/edit/section/:sectionId/item/:itemId">
          <PageComponents.FormEditor />
        </Route>
        <Route path="/admin_forms/:id/edit/section/:sectionId">
          <PageComponents.FormEditor />
        </Route>
        <Route path="/admin_forms/:id/edit">
          <PageComponents.FormEditor />
        </Route>
        <Suspense fallback={<PageLoadingIndicator visible iconSet="bootstrap-icons" />}>
          {cachedBodyComponents}
        </Suspense>
      </Routes>
    </AppRootContext.Provider>
  );
}

export default AppRoot;
