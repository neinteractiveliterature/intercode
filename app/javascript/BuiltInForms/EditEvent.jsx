import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ErrorDisplay from '../ErrorDisplay';
import useAsyncFunction from '../useAsyncFunction';
import EditEventHeader from './EditEventHeader';

export default function EditEvent({
  children, cancelPath, showDropButton, event, dropEvent, validateForm,
  updateEvent, onSave, onDrop,
}) {
  const [updateEventCallback, updateError, updateInProgress] = useAsyncFunction(useCallback(
    async () => {
      if (!validateForm()) {
        return;
      }

      await updateEvent();
      onSave();
    },
    [updateEvent, onSave, validateForm],
  ), { suppressError: true });

  const [dropEventCallback, , dropInProgress] = useAsyncFunction(useCallback(
    async () => {
      await dropEvent();
      onDrop();
    },
    [dropEvent, onDrop],
  ));

  const saveCaption = (event.id ? 'Save event' : 'Create event');

  return (
    <form className="my-4">
      <EditEventHeader
        event={event}
        showDropButton={showDropButton}
        dropEvent={dropEventCallback}
      />

      {children}

      <ErrorDisplay graphQLError={updateError} />

      <div className="d-flex align-items-center mt-4">
        <button
          type="button"
          className="btn btn-primary"
          disabled={updateInProgress || dropInProgress}
          onClick={updateEventCallback}
        >
          {saveCaption}
        </button>

        {cancelPath && <Link to={cancelPath} className="btn btn-link">Cancel</Link>}
      </div>
    </form>
  );
}

EditEvent.propTypes = {
  children: PropTypes.node,
  cancelPath: PropTypes.string,
  showDropButton: PropTypes.bool,
  event: PropTypes.shape({}).isRequired,
  dropEvent: PropTypes.func,
  validateForm: PropTypes.func.isRequired,
  updateEvent: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDrop: PropTypes.func,
};

EditEvent.defaultProps = {
  children: null,
  cancelPath: null,
  showDropButton: false,
  dropEvent: null,
  onDrop: null,
};
