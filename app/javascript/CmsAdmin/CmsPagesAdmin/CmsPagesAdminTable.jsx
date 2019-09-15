import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { CmsPagesAdminQuery } from './queries.gql';
import { DeletePage } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { sortByLocaleString } from '../../ValueUtils';
import useQuerySuspended from '../../useQuerySuspended';
import { useConfirm } from '../../ModalDialogs/Confirm';
import { useDeleteMutation } from '../../MutationUtils';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';

function CmsPagesAdminTable() {
  const { data, error } = useQuerySuspended(CmsPagesAdminQuery);
  const confirm = useConfirm();
  const deletePageMutate = useDeleteMutation(DeletePage, {
    query: CmsPagesAdminQuery,
    arrayPath: ['cmsPages'],
    idVariablePath: ['id'],
  });

  usePageTitle(useValueUnless(() => 'CMS Pages', error));

  const pagesSorted = useMemo(
    () => {
      if (error) {
        return [];
      }

      return sortByLocaleString(data.cmsPages, (page) => page.name);
    },
    [data, error],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const deletePage = (id) => deletePageMutate({ variables: { id } });

  return (
    <>
      <table className="table table-striped">
        <tbody>
          {pagesSorted.map((page) => (
            <tr key={page.id}>
              <td>
                <Link to={`/pages/${page.slug}`}>{page.name}</Link>
                {
                  page.admin_notes && page.admin_notes.trim() !== '' && (
                    <>
                      <br />
                      <small>{page.admin_notes}</small>
                    </>
                  )
                }
              </td>
              <td className="text-right">
                {page.current_ability_can_update
                  ? (
                    <Link to={`/cms_pages/${page.id}/edit`} className="btn btn-secondary btn-sm">
                      Edit
                    </Link>
                  )
                  : (
                    <Link to={`/cms_pages/${page.id}/view_source`} className="btn btn-outline-secondary btn-sm">
                      View source
                    </Link>
                  )}
                {page.current_ability_can_delete && (
                  <button
                    type="button"
                    onClick={() => confirm({
                      prompt: `Are you sure you want to delete ${page.name}?`,
                      action: () => deletePage(page.id),
                      renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                    })}
                    className="btn btn-danger btn-sm ml-1"
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
        <Link to="/cms_pages/new" className="btn btn-secondary">New Page</Link>
      )}
    </>
  );
}

export default CmsPagesAdminTable;
