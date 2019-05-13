import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter } from 'react-router-dom';

import { AppRootQuery } from './appRootQueries.gql';
import AppRouter from './AppRouter';
import ErrorDisplay from './ErrorDisplay';
import NavigationBar from './NavigationBar';
import parsePageContent, { DEFAULT_COMPONENT_MAP } from './parsePageContent';
import useQuerySuspended from './useQuerySuspended';

function AppRoot() {
  const { data, error } = useQuerySuspended(AppRootQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { bodyComponents, headComponents } = parsePageContent(
    data.cmsParent.default_layout.content_html,
    { ...DEFAULT_COMPONENT_MAP, AppRouter, NavigationBar },
  );

  return (
    <BrowserRouter basename="/">
      <>
        <Helmet>{headComponents}</Helmet>
        <Suspense fallback={<></>}>
          {bodyComponents}
        </Suspense>
      </>
    </BrowserRouter>
  );
}

export default AppRoot;
