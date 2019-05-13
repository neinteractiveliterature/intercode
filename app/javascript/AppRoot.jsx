import React, { Suspense, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter } from 'react-router-dom';

import { AppRootQuery } from './appRootQueries.gql';
import AppRouter from './AppRouter';
import ErrorDisplay from './ErrorDisplay';
import NavigationBar from './NavigationBar';
import PageLoadingIndicator from './PageLoadingIndicator';
import parsePageContent, { DEFAULT_COMPONENT_MAP } from './parsePageContent';
import useQuerySuspended from './useQuerySuspended';

function AppRoot() {
  const { data, error } = useQuerySuspended(AppRootQuery);

  const { bodyComponents, headComponents } = useMemo(
    () => {
      if (error) {
        return {};
      }

      return parsePageContent(
        data.cmsParent.default_layout.content_html,
        { ...DEFAULT_COMPONENT_MAP, AppRouter, NavigationBar },
      );
    },
    [data, error],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <BrowserRouter basename="/">
      <>
        <Helmet>{headComponents}</Helmet>
        <Suspense fallback={<PageLoadingIndicator visible />}>
          {bodyComponents}
        </Suspense>
      </>
    </BrowserRouter>
  );
}

export default AppRoot;
