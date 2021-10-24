import { ApolloError, useApolloClient } from '@apollo/client';
import { useConfirm, ErrorDisplay, useDeleteMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform';

import CommitableInput from '../../BuiltInFormControls/CommitableInput';
import useAsyncFunction from '../../useAsyncFunction';
import { useDeleteCmsVariableMutation, useSetCmsVariableMutation } from './mutations.generated';
import { CmsVariablesQueryData } from './queries.generated';

export type ExistingVariableRowProps = {
  cmsParent: CmsVariablesQueryData['cmsParent'];
  variable: CmsVariablesQueryData['cmsParent']['cmsVariables'][0];
};

function ExistingVariableRow({ cmsParent, variable }: ExistingVariableRowProps): JSX.Element {
  const [setVariableMutate] = useSetCmsVariableMutation();
  const [setVariable, setVariableError, , clearSetVariableError] = useAsyncFunction(setVariableMutate);
  const [deleteVariableMutate] = useDeleteMutationWithReferenceArrayUpdater(
    useDeleteCmsVariableMutation,
    cmsParent,
    'cmsVariables',
    (variable) => ({ key: variable.key }),
  );
  const [deleteVariable, deleteVariableError, , clearDeleteVariableError] = useAsyncFunction(deleteVariableMutate);
  const confirm = useConfirm();
  const apolloClient = useApolloClient();

  const error = setVariableError || deleteVariableError;
  const clearError = () => {
    clearSetVariableError();
    clearDeleteVariableError();
  };

  const commitVariable = async (value: string) => {
    await setVariable({
      variables: {
        key: variable.key,
        value_json: value,
      },
    });

    return apolloClient.resetStore();
  };

  const deleteConfirmed = async () => {
    await deleteVariable(variable);
    return apolloClient.resetStore();
  };

  return (
    <>
      <tr>
        <td>
          <code>{variable.key}</code>
        </td>
        <td>
          {variable.current_ability_can_update ? (
            <CommitableInput
              className="font-monospace"
              value={variable.value_json}
              onChange={commitVariable}
              onCancel={clearError}
            />
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
