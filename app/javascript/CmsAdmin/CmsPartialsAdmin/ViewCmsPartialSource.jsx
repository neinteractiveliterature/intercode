import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';

import CmsPartialForm from './CmsPartialForm';
import { CmsPartialsAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function ViewCmsPartialSource() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(CmsPartialsAdminQuery);
  const partial = error || loading
    ? null
    : data.cmsPartials.find((p) => id === p.id.toString());

  usePageTitle(useValueUnless(() => `Viewing “${partial.name}” Source`, error || loading));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <CmsPartialForm
      partial={partial}
      readOnly
    />
  );
}

export default ViewCmsPartialSource;
