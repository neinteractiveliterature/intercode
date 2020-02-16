import React from 'react';
import PropTypes from 'prop-types';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

import ErrorDisplay from '../../ErrorDisplay';
import { SetCmsVariableMutation } from './queries.gql';
import updateCmsVariable from './updateCmsVariable';
import useAsyncFunction from '../../useAsyncFunction';

function AddVariableRow({
  variable, onChange, onSave, onCancel,
}) {
  const [setCmsVariableMutate] = useMutation(SetCmsVariableMutation);
  const [setCmsVariable, setError, setInProgress] = useAsyncFunction(setCmsVariableMutate);
  const apolloClient = useApolloClient();

  const save = async () => {
    await setCmsVariable({
      variables: {
        key: variable.key,
        value_json: variable.value_json,
      },
      update: updateCmsVariable,
    });
    await apolloClient.resetStore();

    return onSave(variable.generatedId);
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        save();
        break;

      default:
    }
  };

  return (
    <>
      <tr>
        <td>
          <input
            type="text"
            className="form-control text-monospace"
            value={variable.key}
            onChange={(event) => onChange({ ...variable, key: event.target.value })}
          />
        </td>
        <td>
          <input
            type="text"
            className="form-control text-monospace"
            value={variable.value_json}
            onChange={(event) => onChange({ ...variable, value_json: event.target.value })}
            onKeyDown={handleKeyDown}
          />
        </td>
        <td>
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => onCancel(variable.generatedId)}
              disabled={setInProgress}
            >
              <i className="fa fa-times" />
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={
                variable.key.trim() === ''
                || variable.value_json.trim() === ''
                || setInProgress
              }
              onClick={save}
            >
              <i className="fa fa-check" />
            </button>
          </div>
        </td>
      </tr>
      {
        setError
          ? (
            <tr>
              <td colSpan="3">
                <ErrorDisplay graphQLError={setError} />
              </td>
            </tr>
          )
          : null
      }
    </>
  );
}

AddVariableRow.propTypes = {
  variable: PropTypes.shape({
    generatedId: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    value_json: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddVariableRow;
