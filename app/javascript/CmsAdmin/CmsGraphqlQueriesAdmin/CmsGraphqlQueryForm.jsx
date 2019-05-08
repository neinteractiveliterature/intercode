import React, { lazy, Suspense } from 'react';

import LoadingIndicator from '../../LoadingIndicator';

const SyncCmsGraphqlQueryForm = lazy(() => import(/* webpackChunkName: "cms-graphql-query-form" */ './SyncCmsGraphqlQueryForm'));

function CmsGraphqlQueryForm(props) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <SyncCmsGraphqlQueryForm {...props} />
    </Suspense>
  );
}

export default CmsGraphqlQueryForm;
