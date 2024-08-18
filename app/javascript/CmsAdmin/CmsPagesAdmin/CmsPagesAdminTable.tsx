import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  sortByLocaleString,
  useGraphQLConfirm,
  useDeleteMutationWithReferenceArrayUpdater,
} from '@neinteractiveliterature/litform';

import usePageTitle from '../../usePageTitle';
import { useDeletePageMutation } from './mutations.generated';
import { useCmsPagesAdminLoader } from './loaders';

function CmsPagesAdminTable() {
  const data = useCmsPagesAdminLoader();
  const confirm = useGraphQLConfirm();
  const [deletePage] = useDeleteMutationWithReferenceArrayUpdater(
    useDeletePageMutation,
    data.cmsParent,
    'cmsPages',
    (page) => ({ id: page.id }),
  );

  usePageTitle('CMS Pages');

  const pagesSorted = useMemo(() => {
    return sortByLocaleString(data.cmsParent.cmsPages, (page) => page.name ?? '');
  }, [data]);

  return (
    <>
      <table className="table table-striped">
        <tbody>
          {pagesSorted.map((page) => (
            <tr key={page.id}>
              <td>
                {page.hidden_from_search && (
                  <>
                    <i className="bi-eye-slash" />{' '}
                  </>
                )}
                <Link to={`/pages/${page.slug}`}>{page.name}</Link>
                {page.admin_notes && page.admin_notes.trim() !== '' && (
                  <>
                    <br />
                    <small>{page.admin_notes}</small>
                  </>
                )}
              </td>
              <td className="text-end">
                {page.current_ability_can_update ? (
                  <Link to={`/cms_pages/${page.id}/edit`} className="btn btn-secondary btn-sm">
                    Edit
                  </Link>
                ) : (
                  <Link to={`/cms_pages/${page.id}/view_source`} className="btn btn-outline-secondary btn-sm">
                    View source
                  </Link>
                )}
                {page.current_ability_can_delete && (
                  <button
                    type="button"
                    onClick={() =>
                      confirm({
                        prompt: `Are you sure you want to delete ${page.name}?`,
                        action: () => deletePage(page),
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

      {data.currentAbility.can_create_pages && (
        <Link to="/cms_pages/new" className="btn btn-secondary">
          New Page
        </Link>
      )}
    </>
  );
}

export const Component = CmsPagesAdminTable;
