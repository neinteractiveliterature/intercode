import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ErrorDisplay,
  sortByLocaleString,
  useConfirm,
  PageLoadingIndicator,
} from '@neinteractiveliterature/litform';

import { CmsPartialsAdminQuery } from './queries';
import { DeletePartial } from './mutations';
import { useDeleteMutation } from '../../MutationUtils';
import usePageTitle from '../../usePageTitle';
import { useCmsPartialsAdminQuery } from './queries.generated';

function CmsPartialsAdminTable() {
  const { data, loading, error } = useCmsPartialsAdminQuery();
  const confirm = useConfirm();
  const deletePartialMutate = useDeleteMutation(DeletePartial, {
    query: CmsPartialsAdminQuery,
    arrayPath: ['cmsPartials'],
    idVariablePath: ['id'],
  });

  usePageTitle('CMS Partials');

  const partialsSorted = useMemo(() => {
    if (error || loading || !data) {
      return [];
    }

    return sortByLocaleString(data.cmsPartials, (partial) => partial.name ?? '');
  }, [data, loading, error]);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const deletePartial = (id: number) => deletePartialMutate({ variables: { id } });

  return (
    <>
      <table className="table table-striped">
        <tbody>
          {partialsSorted.map((partial) => (
            <tr key={partial.id}>
              <td>
                {partial.name}
                {partial.admin_notes && partial.admin_notes.trim() !== '' && (
                  <>
                    <br />
                    <small>{partial.admin_notes}</small>
                  </>
                )}
              </td>
              <td className="text-end">
                {partial.current_ability_can_update ? (
                  <Link
                    to={`/cms_partials/${partial.id}/edit`}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </Link>
                ) : (
                  <Link
                    to={`/cms_partials/${partial.id}/view_source`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    View source
                  </Link>
                )}
                {partial.current_ability_can_delete && (
                  <button
                    type="button"
                    onClick={() =>
                      confirm({
                        prompt: 'Are you sure you want to delete this partial?',
                        action: () => deletePartial(partial.id),
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

      {data!.currentAbility.can_create_cms_partials && (
        <Link to="/cms_partials/new" className="btn btn-secondary">
          New partial
        </Link>
      )}
    </>
  );
}

export default CmsPartialsAdminTable;
