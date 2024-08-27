import { ApolloError } from '@apollo/client';
import { useConfirm, ErrorDisplay, LoadingIndicator } from '@neinteractiveliterature/litform';

import CommitableInput from '../../BuiltInFormControls/CommitableInput';
import { CmsVariablesQueryData } from './queries.generated';
import { useActionData, useFetcher } from 'react-router-dom';

export type ExistingVariableRowProps = {
  variable: CmsVariablesQueryData['cmsParent']['cmsVariables'][0];
};

function ExistingVariableRow({ variable }: ExistingVariableRowProps): JSX.Element {
  const error = useActionData();
  const confirm = useConfirm();
  const deleteFetcher = useFetcher();
  const updateFetcher = useFetcher();

  const commitVariable = (value: string) => {
    updateFetcher.submit(
      { value_json: value },
      { action: `./${variable.key}`, method: 'PATCH', preventScrollReset: true },
    );
  };

  const deleteConfirmed = () => {
    deleteFetcher.submit({}, { action: `./${variable.key}`, method: 'DELETE' });
  };

  return (
    <>
      <tr>
        <td>
          <code>{variable.key}</code>
        </td>
        <td>
          {variable.current_ability_can_update ? (
            updateFetcher.state === 'idle' ? (
              <CommitableInput className="font-monospace" value={variable.value_json} onChange={commitVariable} />
            ) : (
              <LoadingIndicator size={8} />
            )
          ) : (
            <span className="font-monospace">{variable.value_json}</span>
          )}
        </td>
        <td>
          {variable.current_ability_can_delete && (
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() =>
                confirm({
                  prompt: `Are you sure you want to delete the variable "${variable.key}"?`,
                  action: deleteConfirmed,
                })
              }
            >
              <i className="bi-trash" />
              <span className="visually-hidden">
                Delete variable &ldquo;
                {variable.key}
                &rdquo;
              </span>
            </button>
          )}
        </td>
      </tr>
      {error ? (
        <tr>
          <td colSpan={3}>
            <ErrorDisplay graphQLError={error as ApolloError} />
          </td>
        </tr>
      ) : null}
    </>
  );
}

export default ExistingVariableRow;
