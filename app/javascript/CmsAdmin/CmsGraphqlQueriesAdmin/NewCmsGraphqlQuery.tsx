import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import {
  ErrorDisplay,
  LoadQueryWrapper,
  useCreateMutationWithReferenceArrayUpdater,
} from '@neinteractiveliterature/litform';

import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import usePageTitle from '../../usePageTitle';

import 'graphiql/graphiql.css';
import { CmsGraphqlQueryFieldsFragmentDoc, useCmsGraphqlQueriesQuery } from './queries.generated';
import { useCreateCmsGraphqlQuery } from './mutations.generated';
import { useCmsGraphqlQueriesAdminLoader } from './loaders';

function NewCmsGraphqlQuery(): JSX.Element {
  const data = useCmsGraphqlQueriesAdminLoader();
  const navigate = useNavigate();
  const [query, setQuery] = useState({ identifier: '', admin_notes: '', query: '' });
  const [create, { error: createError, loading: createInProgress }] = useCreateMutationWithReferenceArrayUpdater(
    useCreateCmsGraphqlQuery,
    data.cmsParent,
    'cmsGraphqlQueries',
    (data) => data.createCmsGraphqlQuery.query,
    CmsGraphqlQueryFieldsFragmentDoc,
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

    navigate('/cms_graphql_queries');
  };

  return (
    <>
      <h2 className="mb-4">New GraphQL query</h2>

      <div className="mb-4">
        <CmsGraphqlQueryForm value={query} onChange={setQuery} />
      </div>

      <ErrorDisplay graphQLError={createError as ApolloError} />

      <button type="button" className="btn btn-primary" disabled={createInProgress} onClick={createClicked}>
        Create GraphQL query
      </button>
    </>
  );
}

export const Component = NewCmsGraphqlQuery;
