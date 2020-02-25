import React, { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useRouteMatch } from 'react-router-dom';

import { CmsContentGroupsAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import usePageTitle from '../../usePageTitle';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function ViewCmsContentGroup() {
  const { params } = useRouteMatch();
  const { data, loading, error } = useQuery(CmsContentGroupsAdminQuery);
  const contentGroup = useMemo(
    () => {
      if (loading || error) {
        return null;
      }

      return data.cmsContentGroups.find((group) => group.id.toString() === params.id);
    },
    [data, loading, error, params.id],
  );

  usePageTitle(`Editing “${(contentGroup || {}).name}”`);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h3 className="mb-4">{contentGroup.name}</h3>

      <CmsContentGroupFormFields
        contentGroup={contentGroup}
        convention={data.convention}
        readOnly
      />
    </>
  );
}

export default ViewCmsContentGroup;
