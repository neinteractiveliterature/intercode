import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { CmsGraphqlQueriesQuery } from './queries.gql';
import CmsGraphqlQueryForm from './CmsGraphqlQueryForm';
import { UpdateCmsGraphqlQuery } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import useAsyncFunction from '../../useAsyncFunction';
import useMutationCallback from '../../useMutationCallback';
import useQuerySuspended from '../../useQuerySuspended';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';

import 'graphiql/graphiql.css';

function EditCmsGraphqlQuery({ initialQuery, history }) {
  const { data, error } = useQuerySuspended(CmsGraphqlQueriesQuery);
  const [query, setQuery] = useState(initialQuery);
  const [update, updateError, updateInProgress] = useAsyncFunction(
    useMutationCallback(UpdateCmsGraphqlQuery),
  );

  usePageTitle(`Editing “${initialQuery.identifier}”`, useValueUnless(() => data.convention, error));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

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
  initialQuery: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    admin_notes: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditCmsGraphqlQuery;
