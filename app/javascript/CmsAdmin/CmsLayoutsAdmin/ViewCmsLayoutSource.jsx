import React from 'react';
import PropTypes from 'prop-types';

import CmsLayoutForm from './CmsLayoutForm';
import { CmsLayoutsAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useQuerySuspended from '../../useQuerySuspended';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';

function ViewCmsLayoutSource({ match }) {
  const { data, error } = useQuerySuspended(CmsLayoutsAdminQuery);
  const layout = error
    ? null
    : data.cmsLayouts.find((p) => match.params.id === p.id.toString());

  usePageTitle(useValueUnless(() => `View “${layout.name}” Source`, error));

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

ViewCmsLayoutSource.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ViewCmsLayoutSource;
