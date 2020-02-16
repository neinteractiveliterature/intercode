import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';

import CmsLayoutForm from './CmsLayoutForm';
import { CmsLayoutsAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function ViewCmsLayoutSource() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(CmsLayoutsAdminQuery);
  const layout = loading || error
    ? null
    : data.cmsLayouts.find((l) => id === l.id.toString());

  usePageTitle(useValueUnless(() => `View “${layout.name}” Source`, loading || error));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <CmsLayoutForm
      layout={layout}
      readOnly
    />
  );
}

export default ViewCmsLayoutSource;
