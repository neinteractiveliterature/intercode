import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import useFormResponse from '../FormPresenter/useFormResponse';
import useValidatableForm from '../FormPresenter/useValidatableForm';
import SinglePageFormPresenter from '../FormPresenter/SinglePageFormPresenter';
import { ItemInteractionTrackerContext } from '../FormPresenter/ItemInteractionTracker';
import Form from '../Models/Form';

const buildSingleBucketRegistrationPolicy = totalSlots => ({
  buckets: [
    {
      key: 'signups',
      name: 'Signups',
      description: 'Signups for this event',
      anything: false,
      slots_limited: true,
      minimum_slots: totalSlots,
      preferred_slots: totalSlots,
      total_slots: totalSlots,
    },
  ],
});

const BLANK_EVENT = {
  form_response_attrs: {
    can_play_concurrently: false,
    con_mail_destination: 'event_email',
    title: '',
    email: '',
    short_blurb: '',
    description: '',
    length_seconds: null,
    registration_policy: buildSingleBucketRegistrationPolicy(null),
  },
};

const processFormResponseValue = (key, value) => {
  switch (key) {
    case 'can_play_concurrently':
      return { can_play_concurrently: (value === 'true') };
    case 'total_slots':
      return {
        total_slots: value,
        registration_policy: buildSingleBucketRegistrationPolicy(Number.parseInt(value, 10)),
      };
    default:
      return { [key]: value };
  }
};

export default function useEventForm({
  convention, initialEvent, eventForm,
}) {
  const [event, setEvent] = useState(initialEvent
    ? { ...BLANK_EVENT, ...initialEvent }
    : BLANK_EVENT);

  const [, eventAttrsChanged] = useFormResponse(event, setEvent);

  const { formRef, validate, itemInteractionTrackingProps } = useValidatableForm();

  const formResponseValuesChanged = useCallback(
    (newResponseValues) => {
      const processedResponseValues = Object.entries(newResponseValues).reduce(
        (processed, [key, value]) => ({
          ...processed,
          ...processFormResponseValue(key, value),
        }),
        {},
      );

      eventAttrsChanged(processedResponseValues);
    },
    [eventAttrsChanged],
  );

  const validateForm = useCallback(
    () => validate(eventForm.getAllItems(), event.form_response_attrs),
    [event.form_response_attrs, eventForm, validate],
  );

  const eventFormProps = {
    event, eventForm, convention, itemInteractionTrackingProps, formResponseValuesChanged, formRef,
  };

  return [
    eventFormProps,
    {
      event,
      setEvent,
      eventForm,
      validateForm,
    },
  ];
}

export function EventForm({
  eventForm, convention, itemInteractionTrackingProps, event,
  formResponseValuesChanged, formRef, children,
}) {
  return (
    <ItemInteractionTrackerContext.Provider value={itemInteractionTrackingProps}>
      <SinglePageFormPresenter
        form={eventForm}
        convention={convention}
        response={event.form_response_attrs}
        responseValuesChanged={formResponseValuesChanged}
        ref={formRef}
      >
        {children}
      </SinglePageFormPresenter>
    </ItemInteractionTrackerContext.Provider>
  );
}

EventForm.propTypes = {
  eventForm: Form.propType.isRequired,
  convention: PropTypes.shape({}).isRequired,
  itemInteractionTrackingProps: PropTypes.shape({}).isRequired,
  event: PropTypes.shape({
    form_response_attrs: PropTypes.shape({}).isRequired,
  }).isRequired,
  formResponseValuesChanged: PropTypes.func.isRequired,
  formRef: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
};

EventForm.defaultProps = {
  children: null,
};
