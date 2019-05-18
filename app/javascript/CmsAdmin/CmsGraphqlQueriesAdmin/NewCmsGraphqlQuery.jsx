import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { CmsGraphqlQueriesQuery } from './queries.gql';
import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import { CreateCmsGraphqlQuery } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useAsyncFunction from '../../useAsyncFunction';
import useQuerySuspended from '../../useQuerySuspended';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';

import 'graphiql/graphiql.css';
import { useCreateMutation } from '../../MutationUtils';

function NewCmsGraphqlQuery({ history }) {
  const { data, error } = useQuerySuspended(CmsGraphqlQueriesQuery);
  const [query, setQuery] = useState({ identifier: '', admin_notes: '', query: '' });
  const [create, createError, createInProgress] = useAsyncFunction(
    useCreateMutation(CreateCmsGraphqlQuery, {
      query: CmsGraphqlQueriesQuery,
      arrayPath: ['cmsGraphqlQueries'],
      newObjectPath: ['createCmsGraphqlQuery', 'query'],
    }),
  );

  usePageTitle('CMS GraphQL Queries', useValueUnless(() => data.convention, error));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const createClicked = async () => {
    await create({
      variables: {
        query: {
          identifier: query.identifier,
          admin_notes: query.admin_notes,
          query: query.query,
        },
      },
    });

    history.push('/cms_graphql_queries');
  };

  return (
    <>
      <h2 className="mb-4">New GraphQL query</h2>

      <div className="mb-4">
        <CmsGraphqlQueryForm value={query} onChange={setQuery} />
      </div>

      <ErrorDisplay graphQLError={createError} />

      <button
        type="button"
        className="btn btn-primary"
        disabled={createInProgress}
        onClick={createClicked}
      >
        Create GraphQL query
      </button>
    </>
  );
}

NewCmsGraphqlQuery.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default NewCmsGraphqlQuery;
