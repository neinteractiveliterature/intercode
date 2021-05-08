import { Link } from 'react-router-dom';

import { CmsGraphqlQueriesQuery } from './queries';
import { useConfirm } from '../../ModalDialogs/Confirm';
import { DeleteCmsGraphqlQuery } from './mutations';
import ErrorDisplay from '../../ErrorDisplay';
import usePageTitle from '../../usePageTitle';
import { useDeleteMutation } from '../../MutationUtils';
import PageLoadingIndicator from '../../PageLoadingIndicator';
import { useCmsGraphqlQueriesQuery } from './queries.generated';

function CmsGraphqlQueriesAdminTable() {
  const { data, loading, error } = useCmsGraphqlQueriesQuery(); // lolcry
  const deleteCmsGraphqlQuery = useDeleteMutation(DeleteCmsGraphqlQuery, {
    query: CmsGraphqlQueriesQuery,
    idVariablePath: ['id'],
    arrayPath: ['cmsGraphqlQueries'],
  });
  const confirm = useConfirm();

  usePageTitle('CMS GraphQL Queries');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <table className="table table-striped">
        <tbody>
          {data!.cmsGraphqlQueries.map((query) => (
            <tr key={query.id}>
              <td>
                <code>{query.identifier}</code>
                {query.admin_notes ? (
                  <>
                    <br />
                    {query.admin_notes}
                  </>
                ) : null}
              </td>
              <td className="text-right">
                {query.current_ability_can_update ? (
                  <Link
                    to={`/cms_graphql_queries/${query.id}/edit`}
                    className="btn btn-sm btn-secondary me-2"
                  >
                    Edit
                  </Link>
                ) : (
                  <Link
                    to={`/cms_graphql_queries/${query.id}/view_source`}
                    className="btn btn-sm btn-outline-secondary me-2"
                  >
                    View source
                  </Link>
                )}
                {query.current_ability_can_delete && (
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      confirm({
                        prompt: `Are you sure you want to delete the query '${query.identifier}'?`,
                        action: () =>
                          deleteCmsGraphqlQuery({
                            variables: { id: query.id },
                          }),
                        renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                      })
                    }
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data!.currentAbility.can_create_cms_graphql_queries && (
        <Link to="/cms_graphql_queries/new" className="btn btn-primary">
          New GraphQL query
        </Link>
      )}
    </>
  );
}

export default CmsGraphqlQueriesAdminTable;
