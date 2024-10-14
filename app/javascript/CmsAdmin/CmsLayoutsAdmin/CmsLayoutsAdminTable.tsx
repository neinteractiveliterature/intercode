import { useMemo } from 'react';
import { Link, useSubmit } from 'react-router';
import { ErrorDisplay, useConfirm, sortByLocaleString } from '@neinteractiveliterature/litform';

import usePageTitle from '../../usePageTitle';
import { useCmsLayoutsAdminLoader } from './loaders';

function CmsLayoutsAdminTable() {
  const data = useCmsLayoutsAdminLoader();
  const confirm = useConfirm();
  const submit = useSubmit();

  const layoutsSorted = useMemo(() => {
    return sortByLocaleString(data.cmsParent.cmsLayouts, (layout) => layout.name ?? '');
  }, [data]);

  usePageTitle('CMS Layouts');

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
                  <Link to={`/cms_layouts/${layout.id}/view_source`} className="btn btn-outline-secondary btn-sm">
                    View source
                  </Link>
                )}
                {layout.current_ability_can_delete && (
                  <button
                    type="button"
                    onClick={() =>
                      confirm({
                        prompt: 'Are you sure you want to delete this layout?',
                        action: () => submit(null, { action: layout.id, method: 'DELETE' }),
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

      {data.currentAbility.can_create_cms_layouts && (
        <Link to="/cms_layouts/new" className="btn btn-secondary">
          New layout
        </Link>
      )}
    </>
  );
}

export const Component = CmsLayoutsAdminTable;
