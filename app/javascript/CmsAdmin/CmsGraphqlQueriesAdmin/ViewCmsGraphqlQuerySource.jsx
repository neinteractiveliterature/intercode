import React from 'react';
import PropTypes from 'prop-types';

import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import { CmsGraphqlQueriesQuery } from './queries.gql';
import usePageTitle from '../../usePageTitle';
import useQuerySuspended from '../../useQuerySuspended';

import 'graphiql/graphiql.css';

function ViewCmsGraphqlQuerySource({ match }) {
  const { data, error } = useQuerySuspended(CmsGraphqlQueriesQuery);
  const query = error
    ? null
    : data.cmsGraphqlQueries.find((q) => q.id.toString() === match.params.id);

  usePageTitle(`View “${query.identifier}” Source`);

  return (
    <>
      <h2 className="mb-4">View GraphQL query source</h2>

      <div className="mb-4">
        <CmsGraphqlQueryForm value={query} readOnly />
      </div>
    </>
  );
}

ViewCmsGraphqlQuerySource.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ViewCmsGraphqlQuerySource;
