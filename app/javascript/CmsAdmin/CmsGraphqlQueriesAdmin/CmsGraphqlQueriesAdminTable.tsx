import { Link, useSubmit } from 'react-router-dom';
import { ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';

import usePageTitle from '../../usePageTitle';
import { useCmsGraphqlQueriesAdminLoader } from './loaders';

function CmsGraphqlQueriesAdminTable(): JSX.Element {
  const data = useCmsGraphqlQueriesAdminLoader();
  const submit = useSubmit();
  const confirm = useConfirm();

  usePageTitle('CMS GraphQL Queries');

  return (
    <>
      <table className="table table-striped">
        <tbody>
          {data.cmsParent.cmsGraphqlQueries.map((query) => (
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
              <td className="text-end">
                {query.current_ability_can_update ? (
                  <Link to={`/cms_graphql_queries/${query.id}/edit`} className="btn btn-sm btn-secondary me-2">
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
                        action: () => submit({}, { action: `./${query.id}`, method: 'DELETE' }),
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
      {data.currentAbility.can_create_cms_graphql_queries && (
        <Link to="/cms_graphql_queries/new" className="btn btn-primary">
          New GraphQL query
        </Link>
      )}
    </>
  );
}

export const Component = CmsGraphqlQueriesAdminTable;
