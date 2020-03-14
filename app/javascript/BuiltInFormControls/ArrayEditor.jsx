import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useConfirm } from '../ModalDialogs/Confirm';
import ErrorDisplay from '../ErrorDisplay';

function ArrayEditor({
  array, onChange,
  header,
  renderValue,
  getDeleteButtonLabel, getDeletePrompt,
  renderAddValueInput, addValueLabel,
}) {
  const confirm = useConfirm();
  const [addingValue, setAddingValue] = useState('');
  const addValue = () => {
    if (addingValue == null || addingValue.trim().length === 0) {
      return;
    }

    onChange([...array, addingValue]);
    setAddingValue('');
  };
  const keyDownInAddValueInput = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addValue();
    }
  };
  const deleteValue = (alias) => {
    onChange(array.filter((a) => alias !== a));
  };

  return (
    <fieldset className="card form-group">
      <div className="card-header">
        {header}
      </div>

      <ul className="list-group list-group-flush">
        {array.map((value, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li className="list-group-item" key={index}>
            <div className="d-flex">
              <div className="flex-grow-1">
                {renderValue(value)}
              </div>
              <button
                type="button"
                className="btn-sm btn-outline-danger"
                aria-label={getDeleteButtonLabel(value)}
                onClick={() => confirm({
                  prompt: getDeletePrompt(value),
                  action: () => deleteValue(value),
                  renderError: (e) => <ErrorDisplay graphQLError={e} />,
                })}
              >
                <i className="fa fa-trash-o" />
              </button>
            </div>
          </li>
        ))}
        <li className="list-group-item">
          <div className="d-flex">
            <div className="flex-grow-1">
              {renderAddValueInput({
                value: addingValue,
                onChange: setAddingValue,
                onKeyDown: keyDownInAddValueInput,
              })}
            </div>
            <button
              type="button"
              className="ml-2 btn btn-outline-primary"
              onClick={addValue}
            >
              {addValueLabel}
            </button>
          </div>
        </li>
      </ul>
    </fieldset>
  );
}

ArrayEditor.propTypes = {
  header: PropTypes.node.isRequired,
  array: PropTypes.arrayOf(PropTypes.any).isRequired,
  onChange: PropTypes.func.isRequired,
  renderValue: PropTypes.func.isRequired,
  getDeleteButtonLabel: PropTypes.func.isRequired,
  getDeletePrompt: PropTypes.func.isRequired,
  renderAddValueInput: PropTypes.func.isRequired,
  addValueLabel: PropTypes.node.isRequired,
};

export default ArrayEditor;
