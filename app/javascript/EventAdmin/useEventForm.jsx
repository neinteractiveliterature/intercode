import React, { useCallback, useState } from 'react';

import { buildRegistrationPolicyForVolunteerEvent } from '../BuiltInForms/CommonEventFormFields';
import useFormResponse from '../FormPresenter/useFormResponse';
import useValidatableForm from '../FormPresenter/useValidatableForm';
import SinglePageFormPresenter from '../FormPresenter/SinglePageFormPresenter';

const BLANK_EVENT = {
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
};

const processFormResponseValue = (key, value) => {
  switch (key) {
    case 'can_play_concurrently':
      return { can_play_concurrently: (value === 'true') };
    case 'total_slots':
      return {
        total_slots: value,
        registration_policy: buildRegistrationPolicyForVolunteerEvent(Number.parseInt(value, 10)),
      };
    default:
      return { [key]: value };
  }
};

export default function useEventForm({
  convention, initialEvent, eventForm,
}) {
  const [event, setEvent] = useState(initialEvent || BLANK_EVENT);

  const [, eventAttrsChanged] = useFormResponse(event, setEvent);

  const { formRef, validate, renderItemInteractionProvider } = useValidatableForm();

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

  const renderForm = useCallback(
    children => renderItemInteractionProvider((
      <>
        <SinglePageFormPresenter
          form={eventForm}
          convention={convention}
          response={event.form_response_attrs}
          responseValuesChanged={formResponseValuesChanged}
          ref={formRef}
        >
          {children}
        </SinglePageFormPresenter>
      </>
    )),
    [
      event, convention, eventForm, formResponseValuesChanged,
      formRef, renderItemInteractionProvider,
    ],
  );

  const validateForm = useCallback(
    () => validate(eventForm.getAllItems(), event.form_response_attrs),
    [event.form_response_attrs, eventForm, validate],
  );

  return {
    event, setEvent, eventForm, validateForm, renderForm,
  };
}
