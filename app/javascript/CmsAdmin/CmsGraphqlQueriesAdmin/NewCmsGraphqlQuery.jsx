import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { CmsGraphqlQueriesQuery } from './queries.gql';
import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import { CreateCmsGraphqlQuery } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';
import { useCreateMutation } from '../../MutationUtils';

import 'graphiql/graphiql.css';

function NewCmsGraphqlQuery() {
  const history = useHistory();
  const [query, setQuery] = useState({ identifier: '', admin_notes: '', query: '' });
  const [create, createError, createInProgress] = useAsyncFunction(
    useCreateMutation(CreateCmsGraphqlQuery, {
      query: CmsGraphqlQueriesQuery,
      arrayPath: ['cmsGraphqlQueries'],
      newObjectPath: ['createCmsGraphqlQuery', 'query'],
    }),
  );

  usePageTitle('CMS GraphQL Queries');

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

export default NewCmsGraphqlQuery;
