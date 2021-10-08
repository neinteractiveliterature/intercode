import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ErrorDisplay,
  sortByLocaleString,
  useConfirm,
  LoadQueryWrapper,
  deleteObjectFromReferenceArrayUpdater,
} from '@neinteractiveliterature/litform';

import usePageTitle from '../../usePageTitle';
import { useCmsContentGroupsAdminQuery } from './queries.generated';
import { useDeleteContentGroupMutation } from './mutations.generated';

export default LoadQueryWrapper(useCmsContentGroupsAdminQuery, function CmsContentGroupsAdminTable({ data }) {
  const confirm = useConfirm();
  const [deleteContentGroupMutate] = useDeleteContentGroupMutation();

  usePageTitle('CMS Content Groups');

  const contentGroupsSorted = useMemo(() => {
    return sortByLocaleString(data.cmsParent.cmsContentGroups, (contentGroup) => contentGroup.name);
  }, [data]);

  const deleteContentGroup = (contentGroup: typeof data.cmsParent.cmsContentGroups[number]) =>
    deleteContentGroupMutate({
      variables: { id: contentGroup.id },
      update: deleteObjectFromReferenceArrayUpdater(data.cmsParent, 'cmsContentGroups', contentGroup),
    });

  return (
    <>
      <table className="table table-striped">
        <tbody>
          {contentGroupsSorted.map((contentGroup) => (
            <tr key={contentGroup.id}>
              <td>{contentGroup.name}</td>
              <td className="text-end">
                {contentGroup.current_ability_can_update ? (
                  <Link to={`/cms_content_groups/${contentGroup.id}/edit`} className="btn btn-secondary btn-sm">
                    Edit
                  </Link>
                ) : (
                  <Link to={`/cms_content_groups/${contentGroup.id}`} className="btn btn-outline-secondary btn-sm">
                    View configuration
                  </Link>
                )}
                {contentGroup.current_ability_can_delete && (
                  <button
                    type="button"
                    onClick={() =>
                      confirm({
                        prompt: 'Are you sure you want to delete this content group?',
                        action: () => deleteContentGroup(contentGroup),
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

      {data.currentAbility.can_create_cms_content_groups && (
        <Link to="/cms_content_groups/new" className="btn btn-secondary">
          New content group
        </Link>
      )}
    </>
  );
});
