import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router-dom';

import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import { CmsGraphqlQueriesQuery } from './queries.gql';
import { UpdateCmsGraphqlQuery } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';
import PageLoadingIndicator from '../../PageLoadingIndicator';

import 'graphiql/graphiql.css';

function EditCmsGraphqlQueryForm({ initialQuery }) {
  const history = useHistory();
  const [query, setQuery] = useState(initialQuery);
  const [updateMutate] = useMutation(UpdateCmsGraphqlQuery);
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
    history.push('/cms_graphql_queries');
  };

  const [save, saveError, saveInProgress] = useAsyncFunction(saveClicked);

  usePageTitle(`Editing “${initialQuery.identifier}”`);

  return (
    <>
      <h2 className="mb-4">Edit GraphQL query</h2>

      <div className="mb-4">
        <CmsGraphqlQueryForm value={query} readOnly={saveInProgress} onChange={setQuery} />
      </div>

      <ErrorDisplay graphQLError={saveError} />

      <button
        type="button"
        className="btn btn-primary"
        disabled={saveInProgress}
        onClick={save}
      >
        Save GraphQL query
      </button>
    </>
  );
}

EditCmsGraphqlQueryForm.propTypes = {
  initialQuery: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
  }).isRequired,
};

function EditCmsGraphqlQuery() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(CmsGraphqlQueriesQuery);
  const initialQuery = useMemo(
    () => (
      error || loading
        ? null
        : data.cmsGraphqlQueries.find((q) => q.id.toString() === id)
    ),
    [data, loading, error, id],
  );

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  return <EditCmsGraphqlQueryForm initialQuery={initialQuery} />;
}

export default EditCmsGraphqlQuery;
