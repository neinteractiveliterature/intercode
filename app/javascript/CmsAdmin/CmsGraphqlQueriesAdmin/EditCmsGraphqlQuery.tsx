import { useState } from 'react';
import { ApolloError, useApolloClient } from '@apollo/client';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';

import 'graphiql/graphiql.css';
import { useUpdateCmsGraphqlQuery } from './mutations.generated';
import { singleCmsGraphqlQueryAdminLoader, SingleCmsGraphqlQueryAdminLoaderResult } from './loaders';

export const loader = singleCmsGraphqlQueryAdminLoader;

function EditCmsGraphqlQuery() {
  const { graphqlQuery: initialQuery } = useLoaderData() as SingleCmsGraphqlQueryAdminLoaderResult;
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [updateMutate] = useUpdateCmsGraphqlQuery();
  const apolloClient = useApolloClient();

  const saveClicked = async () => {
    await updateMutate({
      variables: {
        id: query.id,
        query: {
          identifier: query.identifier,
          admin_notes: query.admin_notes,
          query: query.query,
        },
      },
    });

    await apolloClient.resetStore();
    navigate('/cms_graphql_queries');
  };

  const [save, saveError, saveInProgress] = useAsyncFunction(saveClicked);

  usePageTitle(`Editing “${initialQuery.identifier}”`);

  return (
    <>
      <h2 className="mb-4">Edit GraphQL query</h2>

      <div className="mb-4">
        <CmsGraphqlQueryForm value={query} readOnly={saveInProgress} onChange={setQuery} />
      </div>

      <ErrorDisplay graphQLError={saveError as ApolloError} />

      <button type="button" className="btn btn-primary" disabled={saveInProgress} onClick={save}>
        Save GraphQL query
      </button>
    </>
  );
}

export const Component = EditCmsGraphqlQuery;
