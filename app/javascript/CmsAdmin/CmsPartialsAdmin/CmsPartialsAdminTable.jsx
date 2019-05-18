import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { CmsPartialsAdminQuery } from './queries.gql';
import { DeletePartial } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { sortByLocaleString } from '../../ValueUtils';
import useQuerySuspended from '../../useQuerySuspended';
import { useConfirm } from '../../ModalDialogs/Confirm';
import { useDeleteMutation } from '../../MutationUtils';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';

function CmsPartialsAdminTable() {
  const { data, error } = useQuerySuspended(CmsPartialsAdminQuery);
  const confirm = useConfirm();
  const deletePartialMutate = useDeleteMutation(DeletePartial, {
    query: CmsPartialsAdminQuery,
    arrayPath: ['cmsPartials'],
    idVariablePath: ['id'],
  });

  usePageTitle(useValueUnless(() => 'CMS Partials', error), useValueUnless(() => data.convention, error));

  const partialsSorted = useMemo(
    () => {
      if (error) {
        return [];
      }

      return sortByLocaleString(data.cmsPartials, partial => partial.name);
    },
    [data, error],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const deletePartial = id => deletePartialMutate({ variables: { id } });

  return (
    <>
      <table className="table table-striped">
        <tbody>
          {partialsSorted.map(partial => (
            <tr key={partial.id}>
              <td>
                {partial.name}
                {
                  partial.admin_notes && partial.admin_notes.trim() !== '' && (
                    <>
                      <br />
                      <small>{partial.admin_notes}</small>
                    </>
                  )
                }
              </td>
              <td className="text-right">
                <Link to={`/cms_partials/${partial.id}/edit`} className="btn btn-secondary btn-sm">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => confirm({
                    prompt: 'Are you sure you want to delete this partial?',
                    action: () => deletePartial(partial.id),
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

      <Link to="/cms_partials/new" className="btn btn-secondary">New partial</Link>
    </>
  );
}

export default CmsPartialsAdminTable;
