import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { CmsPagesAdminQuery } from './queries.gql';
import { DeletePage } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { sortByLocaleString } from '../../ValueUtils';
import useQuerySuspended from '../../useQuerySuspended';
import { useConfirm } from '../../ModalDialogs/Confirm';
import useMutationCallback from '../../useMutationCallback';

function CmsPagesAdminTable() {
  const { data, error } = useQuerySuspended(CmsPagesAdminQuery);
  const confirm = useConfirm();
  const deletePageMutate = useMutationCallback(DeletePage);

  const pagesSorted = useMemo(
    () => {
      if (error) {
        return [];
      }

      return sortByLocaleString(data.cmsPages, page => page.name);
    },
    [data, error],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const deletePage = id => deletePageMutate({
    variables: { id },
    update: (store) => {
      const storeData = store.readQuery({ query: CmsPagesAdminQuery });
      store.writeQuery({
        query: CmsPagesAdminQuery,
        data: {
          ...storeData,
          cmsPages: storeData.cmsPages.filter(cmsPage => cmsPage.id !== id),
        },
      });
    },
  });

  return (
    <>
      <table className="table table-striped">
        {pagesSorted.map(page => (
          <tr key={page.id}>
            <td>
              <a href={`/pages/${page.slug}`}>{page.name}</a>
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
              <Link to={`/cms_pages/${page.id}/edit`} className="btn btn-secondary btn-sm">
                Edit
              </Link>
              <button
                type="button"
                onClick={() => confirm({
                  prompt: `Are you sure you want to delete ${page.name}?`,
                  action: () => deletePage(page.id),
                  renderError: deleteError => <ErrorDisplay graphQLError={deleteError} />,
                })}
                className="btn btn-danger btn-sm ml-1"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </table>

      <Link to="/cms_pages/new" className="btn btn-secondary">New Page</Link>
    </>
  );
}

export default CmsPagesAdminTable;
