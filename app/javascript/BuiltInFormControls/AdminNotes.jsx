import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import ErrorDisplay from '../ErrorDisplay';
import PlainTextDisplay from '../PlainTextDisplay';
import useAsyncFunction from '../useAsyncFunction';

function AdminNotes({ mutate, value }) {
  const [editingValue, setEditingValue] = useState(null);
  const [save, saveError, saveInProgress] = useAsyncFunction(mutate);
  const textareaElement = useRef(null);

  const startEditing = () => {
    setEditingValue(value || '');
    if (textareaElement.current) {
      textareaElement.current.focus();
    }
  };

  const cancelEditing = () => { setEditingValue(null); };

  const saveClicked = async () => {
    await save(editingValue);
    setEditingValue(null);
  };

  if (editingValue == null) {
    return (
      <div className="input-group bg-warning-light border-warning border-1 w-100" style={{ maxWidth: '40em' }}>
        <div className="flex-grow-1 p-1">
          {
            value
              ? <PlainTextDisplay value={value} />
              : <small className="text-muted">Admin notes</small>
          }
        </div>
        <div className="input-group-append">
          <button
            className="btn btn-secondary btn-sm"
            type="button"
            onClick={startEditing}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-warning-light w-100" style={{ maxWidth: '40em' }}>
      <div className="card-body">
        <h5 className="card-title">Admin notes</h5>
        <textarea
          className="form-control"
          value={editingValue}
          onChange={(event) => { setEditingValue(event.target.value); }}
          ref={textareaElement}
        />
        <ErrorDisplay graphQLError={saveError} />
      </div>
      <div className="card-footer text-right">
        <button
          className="btn btn-secondary btn-sm"
          type="button"
          onClick={cancelEditing}
          disabled={saveInProgress}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary btn-sm ml-2"
          type="button"
          onClick={saveClicked}
          disabled={saveInProgress}
        >
          Save
        </button>
      </div>
    </div>
  );
}

AdminNotes.propTypes = {
  mutate: PropTypes.func.isRequired,
  value: PropTypes.string,
};

AdminNotes.defaultProps = {
  value: null,
};

export default AdminNotes;
