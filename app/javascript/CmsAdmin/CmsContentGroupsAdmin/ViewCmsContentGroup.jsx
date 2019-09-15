import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { CmsContentGroupsAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useQuerySuspended from '../../useQuerySuspended';
import usePageTitle from '../../usePageTitle';
import CmsContentGroupFormFields from './CmsContentGroupFormFields';

function ViewCmsContentGroup({ match: { params } }) {
  const { data, error } = useQuerySuspended(CmsContentGroupsAdminQuery);
  const contentGroup = useMemo(
    () => {
      if (error) {
        return null;
      }

      return data.cmsContentGroups.find((group) => group.id.toString() === params.id);
    },
    [data, error, params.id],
  );

  usePageTitle(`Editing “${(contentGroup || {}).name}”`);

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
