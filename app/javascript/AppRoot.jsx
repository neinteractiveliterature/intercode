import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter } from 'react-router-dom';

import { AppRootQuery } from './appRootQueries.gql';
import useQuerySuspended from './useQuerySuspended';
import ErrorDisplay from './ErrorDisplay';
import parsePageContent from './CmsPage/parsePageContent';

function AppRoot() {
  const { data, error } = useQuerySuspended(AppRootQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { bodyComponents, headComponents } = parsePageContent(
    data.cmsParent.default_layout.content_html,
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
