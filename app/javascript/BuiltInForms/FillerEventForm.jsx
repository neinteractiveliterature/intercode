import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { humanize } from 'inflected';

import BootstrapFormSelect from '../BuiltInFormControls/BootstrapFormSelect';
import CommonEventFormFields from './CommonEventFormFields';
import RunFormFields from './RunFormFields';
import { getFormForEventCategoryId } from '../EventAdmin/getFormForEventCategory';
import ErrorDisplay from '../ErrorDisplay';

function FillerEventForm({
  initialEvent, disabled, error, convention, cancelPath, onSave,
}) {
  const [event, setEvent] = useState(initialEvent);
  const [run, setRun] = useState(initialEvent.runs[0] || {});

  const eventFieldChanged = useCallback(
    eventData => setEvent(prevEvent => ({ ...prevEvent, ...eventData })),
    [],
  );

  const runChanged = useCallback(
    runData => setRun(prevRun => ({ ...prevRun, ...runData })),
    [],
  );

  const eventCategoryIdChanged = useCallback(
    e => eventFieldChanged({ event_category: { id: Number.parseInt(e.target.value, 10) } }),
    [eventFieldChanged],
  );

  const saveClicked = useCallback(
    (browserEvent) => {
      browserEvent.preventDefault();
      onSave({ event, run });
    },
    [onSave, event, run],
  );

  const eventCategoryId = (event.event_category || {}).id;

  const form = useMemo(
    () => getFormForEventCategoryId(eventCategoryId, convention),
    [eventCategoryId, convention],
  );

  const saveCaption = (event.id ? 'Save single-run event' : 'Create single-run event');
  let cancelLink = null;
  if (cancelPath) {
    cancelLink = <Link to={cancelPath} className="btn btn-link">Cancel</Link>;
  }

  const categoryOptions = convention.event_categories
    .filter(category => category.scheduling_ui === 'single_run')
    .map(category => (
      <option value={category.id} key={category.id}>{humanize(category.name)}</option>
    ));

  return (
    <form className="my-4">
      <h3 className="mb-4">
        {event.id ? 'Edit single-run event' : 'New single-run event'}
      </h3>

      <BootstrapFormSelect
        label="Category"
        name="category"
        value={event.event_category.id}
        onChange={eventCategoryIdChanged}
      >
        {
          event.id
            ? null
            : <option value={null} />
        }
        {categoryOptions}
      </BootstrapFormSelect>

      <CommonEventFormFields
        event={event}
        convention={convention}
        form={form}
        onChange={eventFieldChanged}
      />

      {event.form_response_attrs.length_seconds && (
        <RunFormFields
          run={run}
          event={{ length_seconds: event.form_response_attrs.length_seconds }}
          convention={convention}
          onChange={runChanged}
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

FillerEventForm.propTypes = {
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

FillerEventForm.defaultProps = {
  cancelPath: null,
  disabled: false,
  error: null,
};

export default FillerEventForm;
