import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { CmsLayoutsAdminQuery } from './queries.gql';
import { DeleteLayout } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { sortByLocaleString } from '../../ValueUtils';
import useQuerySuspended from '../../useQuerySuspended';
import { useConfirm } from '../../ModalDialogs/Confirm';
import { useDeleteMutation } from '../../MutationUtils';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';

function CmsLayoutsAdminTable() {
  const { data, error } = useQuerySuspended(CmsLayoutsAdminQuery);
  const confirm = useConfirm();
  const deleteLayoutMutate = useDeleteMutation(DeleteLayout, {
    query: CmsLayoutsAdminQuery,
    arrayPath: ['cmsLayouts'],
    idVariablePath: ['id'],
  });

  const layoutsSorted = useMemo(
    () => {
      if (error) {
        return [];
      }

      return sortByLocaleString(data.cmsLayouts, layout => layout.name);
    },
    [data, error],
  );

  usePageTitle('CMS Layouts', useValueUnless(() => data.convention, error));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const deleteLayout = id => deleteLayoutMutate({ variables: { id } });

  return (
    <>
      <table className="table table-striped">
        <tbody>
          {layoutsSorted.map(layout => (
            <tr key={layout.id}>
              <td>
                {layout.name}
                {
                  layout.admin_notes && layout.admin_notes.trim() !== '' && (
                    <>
                      <br />
                      <small>{layout.admin_notes}</small>
                    </>
                  )
                }
              </td>
              <td className="text-right">
                <Link to={`/cms_layouts/${layout.id}/edit`} className="btn btn-secondary btn-sm">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => confirm({
                    prompt: 'Are you sure you want to delete this layout?',
                    action: () => deleteLayout(layout.id),
                    renderError: deleteError => <ErrorDisplay graphQLError={deleteError} />,
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

      <Link to="/cms_layouts/new" className="btn btn-secondary">New layout</Link>
    </>
  );
}

export default CmsLayoutsAdminTable;
