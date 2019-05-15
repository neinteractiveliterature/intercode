import React, {
  Suspense, useMemo, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, withRouter } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import { AppRootQuery } from './appRootQueries.gql';
import AppRouter from './AppRouter';
import ErrorDisplay from './ErrorDisplay';
import NavigationBar from './NavigationBar';
import PageLoadingIndicator from './PageLoadingIndicator';
import parsePageContent, { DEFAULT_COMPONENT_MAP } from './parsePageContent';

function AppLayout({ location }) {
  const { data, loading, error } = useQuery(
    AppRootQuery,
    { variables: { path: location.pathname } },
  );

  const [cachedBodyComponents, setCachedBodyComponents] = useState(null);
  const [cachedCmsLayoutId, setCachedCmsLayoutId] = useState(null);
  const [layoutChanged, setLayoutChanged] = useState(false);

  const bodyComponents = useMemo(
    () => {
      if (error || loading) {
        return null;
      }

      return parsePageContent(
        data.effectiveCmsLayout.content_html,
        { ...DEFAULT_COMPONENT_MAP, AppRouter, NavigationBar },
      ).bodyComponents;
    },
    [data, error, loading],
  );

  useEffect(
    () => {
      if (!loading && cachedBodyComponents !== bodyComponents) {
        setCachedBodyComponents(bodyComponents);
      }
    },
    [loading, cachedBodyComponents, bodyComponents],
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
    <Suspense fallback={<PageLoadingIndicator visible />}>{cachedBodyComponents}</Suspense>
  );
}

AppLayout.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

const AppLayoutWithRouter = withRouter(AppLayout);

function AppRoot() {
  return (
    <BrowserRouter basename="/">
      <AppLayoutWithRouter />
    </BrowserRouter>
  );
}

export default AppRoot;
