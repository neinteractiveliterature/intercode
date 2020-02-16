import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import EditRootSite from './EditRootSite';
import { RootSiteAdminQuery } from './queries.gql';
import LoadingIndicator from '../LoadingIndicator';
import ErrorDisplay from '../ErrorDisplay';

function RootSiteAdmin() {
  const { data, loading, error } = useQuery(RootSiteAdminQuery);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <EditRootSite
      initialRootSite={data.rootSite}
      cmsPages={data.cmsPages}
      cmsLayouts={data.cmsLayouts}
    />
  );
}

export default RootSiteAdmin;
