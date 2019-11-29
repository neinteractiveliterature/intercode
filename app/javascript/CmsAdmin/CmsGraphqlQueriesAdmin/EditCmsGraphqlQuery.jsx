import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation } from 'react-apollo-hooks';

import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import { CmsGraphqlQueriesQuery } from './queries.gql';
import { UpdateCmsGraphqlQuery } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useAsyncFunction from '../../useAsyncFunction';
import usePageTitle from '../../usePageTitle';
import useQuerySuspended from '../../useQuerySuspended';

import 'graphiql/graphiql.css';

function EditCmsGraphqlQuery({ match, history }) {
  const { data, error } = useQuerySuspended(CmsGraphqlQueriesQuery);
  const initialQuery = error
    ? null
    : data.cmsGraphqlQueries.find((q) => q.id.toString() === match.params.id);
  const [query, setQuery] = useState(initialQuery);
  const [updateMutate] = useMutation(UpdateCmsGraphqlQuery);
  const [update, updateError, updateInProgress] = useAsyncFunction(updateMutate);
  const apolloClient = useApolloClient();

  usePageTitle(`Editing “${initialQuery.identifier}”`);

  const saveClicked = async () => {
    await update({
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

  return (
    <>
      <h2 className="mb-4">Edit GraphQL query</h2>

      <div className="mb-4">
        <CmsGraphqlQueryForm value={query} onChange={setQuery} />
      </div>

      <ErrorDisplay graphQLError={updateError} />

      <button
        type="button"
        className="btn btn-primary"
        disabled={updateInProgress}
        onClick={saveClicked}
      >
        Save GraphQL query
      </button>
    </>
  );
}

EditCmsGraphqlQuery.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditCmsGraphqlQuery;
