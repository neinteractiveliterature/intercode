import React from 'react';
import PropTypes from 'prop-types';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

import { useConfirm } from '../../ModalDialogs/Confirm';
import CommitableInput from '../../BuiltInFormControls/CommitableInput';
import ErrorDisplay from '../../ErrorDisplay';
import { CmsVariablesQuery, DeleteCmsVariableMutation, SetCmsVariableMutation } from './queries.gql';
import useAsyncFunction from '../../useAsyncFunction';
import { useDeleteMutation } from '../../MutationUtils';

function ExistingVariableRow({ variable }) {
  const [setVariableMutate] = useMutation(SetCmsVariableMutation);
  const [
    setVariable, setVariableError, , clearSetVariableError,
  ] = useAsyncFunction(setVariableMutate);
  const deleteVariableMutate = useDeleteMutation(DeleteCmsVariableMutation, {
    query: CmsVariablesQuery,
    arrayPath: ['cmsVariables'],
    idVariablePath: ['key'],
    idAttribute: 'key',
  });
  const [
    deleteVariable, deleteVariableError, , clearDeleteVariableError,
  ] = useAsyncFunction(deleteVariableMutate);
  const confirm = useConfirm();
  const apolloClient = useApolloClient();

  const error = setVariableError || deleteVariableError;
  const clearError = () => {
    clearSetVariableError();
    clearDeleteVariableError();
  };

  const commitVariable = async (value) => {
    await setVariable({
      variables: {
        key: variable.key,
        value_json: value,
      },
    });

    return apolloClient.resetStore();
  };

  const deleteConfirmed = async () => {
    await deleteVariable({ variables: { key: variable.key } });
    return apolloClient.resetStore();
  };

  return (
    <>
      <tr>
        <td>
          <code>{variable.key}</code>
        </td>
        <td>
          {variable.current_ability_can_update
            ? (
              <CommitableInput
                className="text-monospace"
                value={variable.value_json}
                onChange={commitVariable}
                onCancel={clearError}
              />
            )
            : <span className="text-monospace">{variable.value_json}</span>}
        </td>
        <td>
          {variable.current_ability_can_delete && (
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => confirm({
                prompt: `Are you sure you want to delete the variable "${variable.key}"?`,
                action: deleteConfirmed,
              })}
            >
              <i className="fa fa-trash-o" />
              <span className="sr-only">
                Delete variable &ldquo;
                {variable.key}
                &rdquo;
              </span>
            </button>
          )}
        </td>
      </tr>
      {
        error
          ? (
            <tr>
              <td colSpan="3">
                <ErrorDisplay graphQLError={error} />
              </td>
            </tr>
          )
          : null
      }
    </>
  );
}

ExistingVariableRow.propTypes = {
  variable: PropTypes.shape({
    key: PropTypes.string.isRequired,
    value_json: PropTypes.string.isRequired,
    current_ability_can_update: PropTypes.bool.isRequired,
    current_ability_can_delete: PropTypes.bool.isRequired,
  }).isRequired,
};

export default ExistingVariableRow;
