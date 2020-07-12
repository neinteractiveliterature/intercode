import React, {
  Suspense, useMemo, useState, useEffect,
} from 'react';
import {
  Switch, Route, useLocation, useHistory,
} from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { AppRootQuery } from './appRootQueries.gql';
import AppRouter from './AppRouter';
import ErrorDisplay from './ErrorDisplay';
import NavigationBar from './NavigationBar';
import PageLoadingIndicator from './PageLoadingIndicator';
import AppRootContext from './AppRootContext';
import useCachedLoadableValue from './useCachedLoadableValue';
import PageComponents from './PageComponents';
import parseCmsContent, { CMS_COMPONENT_MAP } from './parseCmsContent';
import { timezoneNameForConvention } from './TimeUtils';
import i18n from './setupI18Next';

// Avoid unnecessary layout checks when moving between pages that can't change layout
function normalizePathForLayout(path) {
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
  const { data, loading, error } = useQuery(
    AppRootQuery,
    { variables: { path: normalizePathForLayout(location.pathname) } },
  );

  const [cachedCmsLayoutId, setCachedCmsLayoutId] = useState(null);
  const [layoutChanged, setLayoutChanged] = useState(false);

  const bodyComponents = useMemo(
    () => {
      if (error || loading) {
        return null;
      }

      return parseCmsContent(
        data.effectiveCmsLayout.content_html,
        { ...CMS_COMPONENT_MAP, AppRouter, NavigationBar },
      ).bodyComponents;
    },
    [data, error, loading],
  );

  const cachedBodyComponents = useCachedLoadableValue(
    loading, error,
    () => bodyComponents,
    [bodyComponents],
  );
  const appRootContextValue = useCachedLoadableValue(
    loading, error,
    () => ({
      assumedIdentityFromProfile: data.assumedIdentityFromProfile,
      cmsNavigationItems: data.cmsNavigationItems,
      conventionAcceptingProposals: data.convention?.accepting_proposals,
      conventionCanceled: data.convention?.canceled,
      conventionName: data.convention?.name,
      conventionDomain: data.convention?.domain,
      currentAbility: data.currentAbility,
      currentPendingOrder: data.currentPendingOrder,
      currentUser: data.currentUser,
      language: data.convention?.language ?? 'en',
      myProfile: data.myProfile,
      rootSiteName: data.rootSite?.site_name,
      siteMode: data.convention?.site_mode,
      signupMode: data.convention?.signup_mode,
      ticketMode: data.convention?.ticket_mode,
      ticketName: data.convention?.ticket_name,
      ticketTypes: data.convention?.ticket_types,
      ticketsAvailableForPurchase: data.convention?.tickets_available_for_purchase,
      timezoneName: timezoneNameForConvention(data.convention),
    }),
    [data],
  );

  useEffect(
    () => {
      if (!loading && !error && cachedCmsLayoutId !== data.effectiveCmsLayout.id) {
        if (cachedCmsLayoutId) {
          // if the layout changed we need a full page reload to rerender the <head>
          setLayoutChanged(true);
          window.location.reload();
        } else {
          setCachedCmsLayoutId(data.effectiveCmsLayout.id);
        }
      }
    },
    [loading, error, cachedCmsLayoutId, data],
  );

  useEffect(
    () => {
      if (
        !loading && !error
        && data.myProfile
        && ((data.convention || {}).clickwrap_agreement || '').trim() !== ''
        && !data.myProfile.accepted_clickwrap_agreement
        && location.pathname !== '/clickwrap_agreement'
        && location.pathname !== '/'
        && !location.pathname.startsWith('/pages')
      ) {
        history.replace('/clickwrap_agreement');
      }
    },
    [data, error, history, loading, location],
  );

  useEffect(
    () => {
      if (appRootContextValue?.language) {
        i18n.changeLanguage(appRootContextValue.language);
      }
    },
    [appRootContextValue?.language],
  );

  if (layoutChanged) {
    return null;
  }

  if (loading && !cachedBodyComponents) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <AppRootContext.Provider value={appRootContextValue}>
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
