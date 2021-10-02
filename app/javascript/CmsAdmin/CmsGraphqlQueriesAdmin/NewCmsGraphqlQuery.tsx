import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { CmsGraphqlQueriesQuery } from './queries';
import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import { CreateCmsGraphqlQuery } from './mutations';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';
import { useCreateMutation } from '../../MutationUtils';

import 'graphiql/graphiql.css';

function NewCmsGraphqlQuery(): JSX.Element {
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

      <ErrorDisplay graphQLError={createError as ApolloError} />

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
