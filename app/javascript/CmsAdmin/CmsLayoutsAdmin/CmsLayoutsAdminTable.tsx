import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ErrorDisplay,
  useConfirm,
  sortByLocaleString,
  PageLoadingIndicator,
} from '@neinteractiveliterature/litform';

import { CmsLayoutsAdminQuery } from './queries';
import { DeleteLayout } from './mutations';
import { useDeleteMutation } from '../../MutationUtils';
import usePageTitle from '../../usePageTitle';
import { useCmsLayoutsAdminQuery } from './queries.generated';

function CmsLayoutsAdminTable() {
  const { data, loading, error } = useCmsLayoutsAdminQuery();
  const confirm = useConfirm();
  const deleteLayoutMutate = useDeleteMutation(DeleteLayout, {
    query: CmsLayoutsAdminQuery,
    arrayPath: ['cmsLayouts'],
    idVariablePath: ['id'],
  });

  const layoutsSorted = useMemo(() => {
    if (loading || error || !data) {
      return [];
    }

    return sortByLocaleString(data.cmsLayouts, (layout) => layout.name ?? '');
  }, [data, loading, error]);

  usePageTitle('CMS Layouts');

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const deleteLayout = (id: number) => deleteLayoutMutate({ variables: { id } });

  return (
    <>
      <table className="table table-striped">
        <tbody>
          {layoutsSorted.map((layout) => (
            <tr key={layout.id}>
              <td>
                {layout.name}
                {layout.admin_notes && layout.admin_notes.trim() !== '' && (
                  <>
                    <br />
                    <small>{layout.admin_notes}</small>
                  </>
                )}
              </td>
              <td className="text-end">
                {layout.current_ability_can_update ? (
                  <Link to={`/cms_layouts/${layout.id}/edit`} className="btn btn-secondary btn-sm">
                    Edit
                  </Link>
                ) : (
                  <Link
                    to={`/cms_layouts/${layout.id}/view_source`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    View source
                  </Link>
                )}
                {layout.current_ability_can_delete && (
                  <button
                    type="button"
                    onClick={() =>
                      confirm({
                        prompt: 'Are you sure you want to delete this layout?',
                        action: () => deleteLayout(layout.id),
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

      {data!.currentAbility.can_create_cms_layouts && (
        <Link to="/cms_layouts/new" className="btn btn-secondary">
          New layout
        </Link>
      )}
    </>
  );
}

export default CmsLayoutsAdminTable;
