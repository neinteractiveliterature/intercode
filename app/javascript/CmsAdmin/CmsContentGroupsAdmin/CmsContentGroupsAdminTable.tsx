import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ErrorDisplay,
  sortByLocaleString,
  useConfirm,
  PageLoadingIndicator,
} from '@neinteractiveliterature/litform';

import { CmsContentGroupsAdminQuery } from './queries';
import { DeleteContentGroup } from './mutations';
import { useDeleteMutation } from '../../MutationUtils';
import usePageTitle from '../../usePageTitle';
import { useCmsContentGroupsAdminQuery } from './queries.generated';

function CmsContentGroupsAdminTable() {
  const { data, loading, error } = useCmsContentGroupsAdminQuery();
  const confirm = useConfirm();
  const deleteContentGroupMutate = useDeleteMutation(DeleteContentGroup, {
    query: CmsContentGroupsAdminQuery,
    arrayPath: ['cmsContentGroups'],
    idVariablePath: ['id'],
  });

  usePageTitle('CMS Content Groups');

  const contentGroupsSorted = useMemo(() => {
    if (loading || error || !data) {
      return [];
    }

    return sortByLocaleString(data.cmsContentGroups, (contentGroup) => contentGroup.name);
  }, [data, loading, error]);

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const deleteContentGroup = (id: number) => deleteContentGroupMutate({ variables: { id } });

  return (
    <>
      <table className="table table-striped">
        <tbody>
          {contentGroupsSorted.map((contentGroup) => (
            <tr key={contentGroup.id}>
              <td>{contentGroup.name}</td>
              <td className="text-end">
                {contentGroup.current_ability_can_update ? (
                  <Link
                    to={`/cms_content_groups/${contentGroup.id}/edit`}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </Link>
                ) : (
                  <Link
                    to={`/cms_content_groups/${contentGroup.id}`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    View configuration
                  </Link>
                )}
                {contentGroup.current_ability_can_delete && (
                  <button
                    type="button"
                    onClick={() =>
                      confirm({
                        prompt: 'Are you sure you want to delete this content group?',
                        action: () => deleteContentGroup(contentGroup.id),
                        renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                      })
                    }
                    className="btn btn-danger btn-sm ms-1"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data!.currentAbility.can_create_cms_content_groups && (
        <Link to="/cms_content_groups/new" className="btn btn-secondary">
          New content group
        </Link>
      )}
    </>
  );
}

export default CmsContentGroupsAdminTable;
