import React from 'react';
import PropTypes from 'prop-types';

import CmsPageForm from './CmsPageForm';
import { CmsPagesAdminQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useQuerySuspended from '../../useQuerySuspended';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';

function ViewCmsPageSource({ match }) {
  const { data, error } = useQuerySuspended(CmsPagesAdminQuery);
  const page = error ? null : data.cmsPages.find((p) => match.params.id === p.id.toString());

  usePageTitle(useValueUnless(() => `View “${page.name}” Source`, error));

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

ViewCmsPageSource.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default ViewCmsPageSource;
