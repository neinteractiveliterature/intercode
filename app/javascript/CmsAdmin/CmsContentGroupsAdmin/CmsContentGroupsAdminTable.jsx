import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { CmsContentGroupsAdminQuery } from './queries.gql';
import { DeleteContentGroup } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { sortByLocaleString } from '../../ValueUtils';
import useQuerySuspended from '../../useQuerySuspended';
import { useConfirm } from '../../ModalDialogs/Confirm';
import { useDeleteMutation } from '../../MutationUtils';
import usePageTitle from '../../usePageTitle';

function CmsContentGroupsAdminTable() {
  const { data, error } = useQuerySuspended(CmsContentGroupsAdminQuery);
  const confirm = useConfirm();
  const deleteContentGroupMutate = useDeleteMutation(DeleteContentGroup, {
    query: CmsContentGroupsAdminQuery,
    arrayPath: ['cmsContentGroups'],
    idVariablePath: ['id'],
  });

  usePageTitle('CMS Content Groups');

  const contentGroupsSorted = useMemo(
    () => {
      if (error) {
        return [];
      }

      return sortByLocaleString(data.cmsContentGroups, (contentGroup) => contentGroup.name);
    },
    [data, error],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const deleteContentGroup = (id) => deleteContentGroupMutate({ variables: { id } });

  return (
    <>
      <table className="table table-striped">
        <tbody>
          {contentGroupsSorted.map((contentGroup) => (
            <tr key={contentGroup.id}>
              <td>
                {contentGroup.name}
                {
                  contentGroup.admin_notes && contentGroup.admin_notes.trim() !== '' && (
                    <>
                      <br />
                      <small>{contentGroup.admin_notes}</small>
                    </>
                  )
                }
              </td>
              <td className="text-right">
                <Link to={`/cms_content_groups/${contentGroup.id}/edit`} className="btn btn-secondary btn-sm">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => confirm({
                    prompt: 'Are you sure you want to delete this content group?',
                    action: () => deleteContentGroup(contentGroup.id),
                    renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                  })}
                  className="btn btn-danger btn-sm ml-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/cms_content_groups/new" className="btn btn-secondary">New content group</Link>
    </>
  );
}

export default CmsContentGroupsAdminTable;
