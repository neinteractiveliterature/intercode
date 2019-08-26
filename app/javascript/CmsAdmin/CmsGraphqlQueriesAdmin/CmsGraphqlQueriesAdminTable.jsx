import React from 'react';
import { Link } from 'react-router-dom';

import { CmsGraphqlQueriesQuery } from './queries.gql';
import { useConfirm } from '../../ModalDialogs/Confirm';
import { DeleteCmsGraphqlQuery } from './mutations.gql';
import useQuerySuspended from '../../useQuerySuspended';
import ErrorDisplay from '../../ErrorDisplay';
import usePageTitle from '../../usePageTitle';
import { useDeleteMutation } from '../../MutationUtils';

function CmsGraphqlQueriesAdminTable() {
  const { data, error } = useQuerySuspended(CmsGraphqlQueriesQuery);
  const deleteCmsGraphqlQuery = useDeleteMutation(DeleteCmsGraphqlQuery, {
    query: CmsGraphqlQueriesQuery,
    idVariablePath: ['id'],
    arrayPath: ['cmsGraphqlQueries'],
  });
  const confirm = useConfirm();

  usePageTitle('CMS GraphQL Queries');

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <table className="table table-striped">
        <tbody>
          {data.cmsGraphqlQueries.map((query) => (
            <tr key={query.id}>
              <td>
                <code>{query.identifier}</code>
                {
                  query.admin_notes
                    ? (
                      <>
                        <br />
                        {query.admin_notes}
                      </>
                    )
                    : null
                }
              </td>
              <td className="text-right">
                <Link to={`/cms_graphql_queries/${query.id}/edit`} className="btn btn-sm btn-secondary mr-2">Edit</Link>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => confirm({
                    prompt: `Are you sure you want to delete the query '${query.identifier}'?`,
                    action: () => deleteCmsGraphqlQuery({
                      variables: { id: query.id },
                    }),
                    renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                  })}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/cms_graphql_queries/new" className="btn btn-primary">
        New GraphQL query
      </Link>
    </>
  );
}

export default CmsGraphqlQueriesAdminTable;
