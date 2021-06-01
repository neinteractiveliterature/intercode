import { Suspense, useMemo, useState, useEffect } from 'react';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
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

const NavigationBar = lazyWithBundleHashCheck(
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
    return `/events/${eventsMatch[1]}`;
  }

  return '/non_cms_path'; // arbitrary path that's not a CMS page
}

function AppRoot() {
  const location = useLocation();
  const history = useHistory();
  const { data, loading, error } = useAppRootQuery({
    variables: { path: normalizePathForLayout(location.pathname) },
  });

  const [cachedCmsLayoutId, setCachedCmsLayoutId] = useState<number>();
  const [layoutChanged, setLayoutChanged] = useState(false);

  const bodyComponents = useMemo(() => {
    if (error || loading || !data) {
      return null;
    }

    return parseCmsContent(data.effectiveCmsLayout?.content_html ?? '', {
      ...CMS_COMPONENT_MAP,
      AppRouter,
      NavigationBar,
    }).bodyComponents;
  }, [data, error, loading]);

  const cachedBodyComponents = useCachedLoadableValue(loading, error, () => bodyComponents, [
    bodyComponents,
  ]);
  const appRootContextValue = useCachedLoadableValue(
    loading,
    error,
    () => ({
      assumedIdentityFromProfile: data!.assumedIdentityFromProfile,
      cmsNavigationItems: data!.cmsNavigationItems,
      conventionAcceptingProposals: data!.convention?.accepting_proposals,
      conventionCanceled: data!.convention?.canceled,
      conventionName: data!.convention?.name,
      conventionDomain: data!.convention?.domain,
      conventionTimespan: data?.convention ? timespanFromConvention(data.convention) : undefined,
      currentAbility: data!.currentAbility,
      currentPendingOrder: data!.currentPendingOrder,
      currentUser: data!.currentUser,
      language: data!.convention?.language ?? 'en',
      myProfile: data!.myProfile,
      rootSiteName: data!.rootSite?.site_name,
      siteMode: data!.convention?.site_mode,
      signupMode: data!.convention?.signup_mode,
      ticketMode: data!.convention?.ticket_mode,
      ticketName: data!.convention?.ticket_name,
      ticketTypes: data!.convention?.ticket_types,
      ticketsAvailableForPurchase: data!.convention?.tickets_available_for_purchase,
      timezoneName: timezoneNameForConvention(data!.convention),
    }),
    [data],
  );

  useEffect(() => {
    if (!loading && !error && data && cachedCmsLayoutId !== data.effectiveCmsLayout.id) {
      if (cachedCmsLayoutId) {
        // if the layout changed we need a full page reload to rerender the <head>
        setLayoutChanged(true);
        window.location.reload();
      } else {
        setCachedCmsLayoutId(data.effectiveCmsLayout.id);
      }
    }
  }, [loading, error, cachedCmsLayoutId, data]);

  useEffect(() => {
    if (
      !loading &&
      !error &&
      data?.myProfile &&
      (data.convention?.clickwrap_agreement || '').trim() !== '' &&
      !data.myProfile.accepted_clickwrap_agreement &&
      location.pathname !== '/clickwrap_agreement' &&
      location.pathname !== '/' &&
      !location.pathname.startsWith('/pages')
    ) {
      history.replace('/clickwrap_agreement');
    }
  }, [data, error, history, loading, location]);

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
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <AppRootContext.Provider value={appRootContextValue!}>
      <Switch>
        <Route path="/admin_forms/:id/edit/section/:sectionId/item/:itemId">
          <PageComponents.FormEditor />
        </Route>
        <Route path="/admin_forms/:id/edit/section/:sectionId">
          <PageComponents.FormEditor />
        </Route>
        <Route path="/admin_forms/:id/edit">
          <PageComponents.FormEditor />
        </Route>
        <Suspense fallback={<PageLoadingIndicator visible />}>{cachedBodyComponents}</Suspense>
      </Switch>
    </AppRootContext.Provider>
  );
}

export default AppRoot;
