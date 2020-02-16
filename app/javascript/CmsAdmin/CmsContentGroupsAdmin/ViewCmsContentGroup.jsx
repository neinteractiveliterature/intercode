import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import { CmsContentGroupsAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import usePageTitle from '../../usePageTitle';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function ViewCmsContentGroup({ match: { params } }) {
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

ViewCmsContentGroup.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ViewCmsContentGroup;
