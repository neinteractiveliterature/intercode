import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ErrorDisplay,
  sortByLocaleString,
  useGraphQLConfirm,
  PageLoadingIndicator,
} from '@neinteractiveliterature/litform';

import { CmsPagesAdminQuery } from './queries';
import { DeletePage } from './mutations';
import { useDeleteMutation } from '../../MutationUtils';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';
import { useCmsPagesAdminQuery } from './queries.generated';

function CmsPagesAdminTable() {
  const { data, loading, error } = useCmsPagesAdminQuery();
  const confirm = useGraphQLConfirm();
  const deletePageMutate = useDeleteMutation(DeletePage, {
    query: CmsPagesAdminQuery,
    arrayPath: ['cmsPages'],
    idVariablePath: ['id'],
  });

  usePageTitle(useValueUnless(() => 'CMS Pages', error || loading));

  const pagesSorted = useMemo(() => {
    if (error || loading || !data) {
      return [];
    }

    return sortByLocaleString(data.cmsPages, (page) => page.name ?? '');
  }, [data, loading, error]);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const deletePage = (id: number) => deletePageMutate({ variables: { id } });

  return (
    <>
      <table className="table table-striped">
        <tbody>
          {pagesSorted.map((page) => (
            <tr key={page.id}>
              <td>
                {page.hidden_from_search && (
                  <>
                    <i className="fa fa-eye-slash" />{' '}
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
                  <Link
                    to={`/cms_pages/${page.id}/view_source`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    View source
                  </Link>
                )}
                {page.current_ability_can_delete && (
                  <button
                    type="button"
                    onClick={() =>
                      confirm({
                        prompt: `Are you sure you want to delete ${page.name}?`,
                        action: () => deletePage(page.id),
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

      {data!.currentAbility.can_create_pages && (
        <Link to="/cms_pages/new" className="btn btn-secondary">
          New Page
        </Link>
      )}
    </>
  );
}

export default CmsPagesAdminTable;
