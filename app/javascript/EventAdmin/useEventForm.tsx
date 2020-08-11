import React, { useCallback, useState, ReactNode, useMemo } from 'react';

import useFormResponse, { FormResponse } from '../FormPresenter/useFormResponse';
import useValidatableForm from '../FormPresenter/useValidatableForm';
import SinglePageFormPresenter from '../FormPresenter/SinglePageFormPresenter';
import {
  ItemInteractionTrackerContext,
  ItemInteractionTrackerContextValue,
} from '../FormPresenter/ItemInteractionTracker';
import { RegistrationPolicy } from '../graphqlTypes.generated';
import { ConventionForFormItemDisplay } from '../FormPresenter/ItemDisplays/FormItemDisplay';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';
import { FormBodyImperativeHandle } from '../FormPresenter/Layouts/FormBody';
import { getSortedParsedFormItems } from '../Models/Form';

function buildSingleBucketRegistrationPolicy(totalSlots?: number | null): RegistrationPolicy {
  return {
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
        expose_attendees: false,
        not_counted: false,
      },
    ],
    prevent_no_preference_signups: false,
  };
}

export const DEFAULT_EVENT_FORM_RESPONSE_ATTRS = {
  can_play_concurrently: false,
  con_mail_destination: 'event_email',
  title: '',
  email: '',
  short_blurb: '',
  description: '',
  length_seconds: null,
  registration_policy: buildSingleBucketRegistrationPolicy(null),
};

const processFormResponseValue = (key: string, value: any) => {
  switch (key) {
    case 'can_play_concurrently':
      return { can_play_concurrently: value === 'true' };
    case 'total_slots':
      return {
        total_slots: value,
        registration_policy: buildSingleBucketRegistrationPolicy(Number.parseInt(value, 10)),
      };
    default:
      return { [key]: value };
  }
};

export type UseEventFormOptions<EventType extends FormResponse> = {
  convention: ConventionForFormItemDisplay;
  initialEvent: EventType;
  eventForm: CommonFormFieldsFragment;
};

export type EventFormProps<EventType extends FormResponse> = {
  eventForm: CommonFormFieldsFragment;
  convention: ConventionForFormItemDisplay;
  itemInteractionTrackingProps: ItemInteractionTrackerContextValue;
  event: EventType;
  formResponseValuesChanged: (newResponseValues: any) => void;
  formRef: React.Ref<FormBodyImperativeHandle | undefined>;
  children?: ReactNode;
};

export default function useEventForm<EventType extends FormResponse>({
  convention,
  initialEvent,
  eventForm,
}: UseEventFormOptions<EventType>) {
  const [event, setEvent] = useState<EventType>(() => ({
    ...initialEvent,
    form_response_attrs: {
      ...DEFAULT_EVENT_FORM_RESPONSE_ATTRS,
      ...initialEvent.form_response_attrs,
    },
  }));

  const [, eventAttrsChanged] = useFormResponse(event, setEvent);

  const { formRef, validate, itemInteractionTrackingProps } = useValidatableForm();

  const formResponseValuesChanged = useCallback(
    (newResponseValues) => {
      const processedResponseValues = Object.entries(newResponseValues).reduce(
        (processed, [key, value]) => ({
          ...processed,
          ...processFormResponseValue(key, value),
        }),
        {} as EventType['form_response_attrs'],
      );

      eventAttrsChanged(processedResponseValues);
    },
    [eventAttrsChanged],
  );

  const formItems = useMemo(() => getSortedParsedFormItems(eventForm), [eventForm]);

  const validateForm = useCallback(() => validate(formItems, event), [event, formItems, validate]);

  const eventFormProps: EventFormProps<EventType> = {
    event,
    eventForm,
    convention,
    itemInteractionTrackingProps,
    formResponseValuesChanged,
    formRef,
  };

  return [
    eventFormProps,
    {
      event,
      setEvent,
      eventForm,
      validateForm,
    },
  ] as const;
}

export function EventForm<EventType extends FormResponse>({
  eventForm,
  convention,
  itemInteractionTrackingProps,
  event,
  formResponseValuesChanged,
  formRef,
  children,
}: EventFormProps<EventType>) {
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
