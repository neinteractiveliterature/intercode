import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { useParams } from 'react-router-dom';

import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import { CmsGraphqlQueriesQuery } from './queries.gql';
import usePageTitle from '../../usePageTitle';
import PageLoadingIndicator from '../../PageLoadingIndicator';
import ErrorDisplay from '../../ErrorDisplay';

import 'graphiql/graphiql.css';

function ViewCmsGraphqlQuerySource() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(CmsGraphqlQueriesQuery);
  const query = loading || error
    ? null
    : data.cmsGraphqlQueries.find((q) => q.id.toString() === id);

  usePageTitle(`View “${(query || {}).identifier}” Source`);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h2 className="mb-4">View GraphQL query source</h2>

      <div className="mb-4">
        <CmsGraphqlQueryForm value={query} readOnly />
      </div>
    </>
  );
}

export default ViewCmsGraphqlQuerySource;
