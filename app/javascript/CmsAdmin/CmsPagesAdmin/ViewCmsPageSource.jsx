import React, { useMemo } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { useParams } from 'react-router-dom';

import CmsPageForm from './CmsPageForm';
import { CmsPagesAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function ViewCmsPageSource() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(CmsPagesAdminQuery);
  const page = useMemo(
    () => (
      error || loading
        ? null
        : data.cmsPages.find((p) => id === p.id.toString())
    ),
    [data, error, loading, id],
  );

  usePageTitle(useValueUnless(() => `View “${page.name}” Source`, error || loading));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <CmsPageForm
      page={page}
      cmsLayouts={data.cmsLayouts}
      cmsParent={data.cmsParent}
      readOnly
    />
  );
}

export default ViewCmsPageSource;
