import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';

import ErrorDisplay from '../ErrorDisplay';
import useAsyncFunction from '../useAsyncFunction';
import EditEventHeader from './EditEventHeader';

export default function useEventEditor({
  event, updateEvent, dropEvent, onSave, onDrop, renderForm, validateForm,
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
  ));

  const [dropEventCallback, , dropInProgress] = useAsyncFunction(useCallback(
    async () => {
      await dropEvent();
      onDrop();
    },
    [dropEvent, onDrop],
  ));

  const saveCaption = (event.id ? 'Save event' : 'Create event');

  const renderEditor = ({ children, cancelPath, showDropButton }) => (
    <form className="my-4">
      <EditEventHeader
        event={event}
        showDropButton={showDropButton}
        dropEvent={dropEventCallback}
      />

      {renderForm(children)}

      <ErrorDisplay graphQLError={updateError} />

      <button
        type="button"
        className="btn btn-primary mt-4"
        disabled={updateInProgress || dropInProgress}
        onClick={updateEventCallback}
      >
        {saveCaption}
      </button>

      {cancelPath && <Link to={cancelPath} className="btn btn-link">Cancel</Link>}
    </form>
  );

  return renderEditor;
}
