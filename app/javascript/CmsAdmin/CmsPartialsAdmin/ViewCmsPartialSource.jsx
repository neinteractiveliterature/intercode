import React from 'react';
import PropTypes from 'prop-types';

import CmsPartialForm from './CmsPartialForm';
import { CmsPartialsAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useQuerySuspended from '../../useQuerySuspended';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';

function ViewCmsPartialSource({ match }) {
  const { data, error } = useQuerySuspended(CmsPartialsAdminQuery);
  const partial = error
    ? null
    : data.cmsPartials.find((p) => match.params.id === p.id.toString());

  usePageTitle(useValueUnless(() => `Viewing “${partial.name}” Source`, error));

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

ViewCmsPartialSource.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ViewCmsPartialSource;
