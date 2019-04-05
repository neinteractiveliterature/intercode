import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { buildRegistrationPolicyForVolunteerEvent } from '../BuiltInForms/CommonEventFormFields';
import EventCategorySelect from '../BuiltInFormControls/EventCategorySelect';
import NewEventForm from './NewEventForm';
import { Transforms } from '../ComposableFormUtils';

function NewEventWithCategorySelection({ convention, onExit, selectableCategoryIds }) {
  const [event, setEvent] = useState({
    event_category: null,
    form_response_attrs: {
      can_play_concurrently: false,
      con_mail_destination: 'event_email',
      title: '',
      email: '',
      short_blurb: '',
      description: '',
      length_seconds: null,
      registration_policy: buildRegistrationPolicyForVolunteerEvent(null),
    },
  });

  const setEventCategoryId = useCallback(
    eventCategoryId => setEvent(prevEvent => ({
      ...prevEvent,
      event_category: {
        id: eventCategoryId,
      },
    })),
    [],
  );

  const eventCategorySelectChanged = useCallback(
    e => setEventCategoryId(Transforms.inputChange(Transforms.integer)(e)),
    [setEventCategoryId],
  );

  const selectableCategories = useMemo(
    () => (selectableCategoryIds
      ? convention.event_categories.filter(category => selectableCategoryIds.includes(category.id))
      : convention.event_categories),
    [convention.event_categories, selectableCategoryIds],
  );

  if (selectableCategories.length === 1 && !event.event_category) {
    setEventCategoryId(selectableCategories[0].id);
  }

  return (
    <div className="my-4">
      <h2 className="mb-3">New event</h2>

      <EventCategorySelect
        eventCategories={selectableCategories}
        value={(event.event_category || {}).id}
        onChange={eventCategorySelectChanged}
      />

      <NewEventForm
        convention={convention}
        onExit={onExit}
        event={event}
        setEvent={setEvent}
      />
    </div>
  );
}

NewEventWithCategorySelection.propTypes = {
  convention: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  onExit: PropTypes.func.isRequired,
  selectableCategoryIds: PropTypes.arrayOf(PropTypes.number),
};

NewEventWithCategorySelection.defaultProps = {
  selectableCategoryIds: null,
};

export default NewEventWithCategorySelection;
