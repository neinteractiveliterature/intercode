import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import RunFormFields from '../BuiltInForms/RunFormFields';
import ErrorDisplay from '../ErrorDisplay';
import useEventFormWithCategorySelection, { EventFormWithCategorySelection } from './useEventFormWithCategorySelection';

function SingleRunEventForm({
  convention, initialEvent, disabled, cancelPath, onSave, error,
}) {
  const [run, setRun] = useState(initialEvent.runs[0] || {});

  const [formProps, {
    event, eventCategoryId, validateForm,
  }] = useEventFormWithCategorySelection({
    convention,
    initialEvent,
    schedulingUi: 'single_run',
  });

  const saveClicked = useCallback(
    async (browserEvent) => {
      browserEvent.preventDefault();
      if (!validateForm()) {
        return;
      }
      await onSave({ event: { ...event, event_category: { id: eventCategoryId } }, run });
    },
    [onSave, event, eventCategoryId, run, validateForm],
  );

  const saveCaption = (event.id ? 'Save single-run event' : 'Create single-run event');
  let cancelLink = null;
  if (cancelPath) {
    cancelLink = <Link to={cancelPath} className="btn btn-link">Cancel</Link>;
  }

  return (
    <form className="my-4">
      <h3 className="mb-4">
        {event.id ? 'Edit single-run event' : 'New single-run event'}
      </h3>

      <EventFormWithCategorySelection {...formProps} />

      {event.form_response_attrs.length_seconds && (
        <RunFormFields
          run={run}
          event={{ length_seconds: event.form_response_attrs.length_seconds }}
          convention={convention}
          onChange={setRun}
        />
      )}

      <ErrorDisplay error={error} />

      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={disabled}>
        {saveCaption}
      </button>
      {cancelLink}
    </form>
  );
}

SingleRunEventForm.propTypes = {
  initialEvent: PropTypes.shape({
    id: PropTypes.number,
    runs: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      rooms: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired).isRequired,
    })).isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string,

  // The convention prop type we're using is already required
  // eslint-disable-next-line react/require-default-props
  convention: RunFormFields.propTypes.convention,
  cancelPath: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};

SingleRunEventForm.defaultProps = {
  cancelPath: null,
  disabled: false,
  error: null,
};

export default SingleRunEventForm;
