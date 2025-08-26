import { useMemo, useEffect } from 'react';

import useEventCategorySelection from './useEventCategorySelection';
import useEventForm, { EventForm, EventFormProps, UseEventFormResult } from './useEventForm';
import EventCategorySelect, { EventCategorySelectProps } from '../BuiltInFormControls/EventCategorySelect';
import { ConventionForEventCategoryForms, EventCategoryFormData } from './getFormForEventCategory';
import { Event, EventCategory } from '../graphqlTypes.generated';
import { FormResponse } from '../FormPresenter/useFormResponse';
import { ConventionForFormItemDisplay } from '../FormPresenter/ItemDisplays/FormItemDisplay';
import { ImageAttachmentConfig } from '../BuiltInFormControls/MarkdownInput';

type EventCategoryForEventFormWithCategorySelection<EventCategoryType extends EventCategoryFormData> =
  ConventionForEventCategoryForms<EventCategoryType>['event_categories'][0] &
    Pick<EventCategory, 'scheduling_ui' | 'name'>;

type ConventionForEventFormWithCategorySelection<EventCategoryType extends EventCategoryFormData> =
  ConventionForFormItemDisplay &
    Omit<ConventionForEventCategoryForms<EventCategoryType>, 'event_categories'> & {
      event_categories: EventCategoryForEventFormWithCategorySelection<EventCategoryType>[];
    };

export type UseEventFormWithCategorySelectionOptions<
  EventCategoryType extends EventCategoryFormData,
  EventType extends FormResponse & { event_category?: { id: string } | null },
> = {
  convention: ConventionForEventFormWithCategorySelection<EventCategoryType>;
  initialEvent: EventType;
  schedulingUi?: string | null;
  imageAttachmentConfig?: ImageAttachmentConfig;
};

export type UseEventFormWithCategorySelectionResult<
  EventType extends FormResponse & {
    event_category?: {
      id: string;
    } | null;
  } & Pick<Event, 'current_user_form_item_viewer_role' | 'current_user_form_item_writer_role'>,
  EventCategoryType extends EventCategoryFormData,
> = [
  {
    selectProps: EventCategorySelectProps;
    eventFormProps: EventFormProps<EventType>;
  },
  UseEventFormResult<EventType>[1] & {
    eventCategoryId?: string;
    eventCategory?: EventCategoryForEventFormWithCategorySelection<EventCategoryType>;
  },
];

export default function useEventFormWithCategorySelection<
  EventCategoryType extends EventCategoryFormData,
  EventType extends FormResponse & { event_category?: { id: string } | null } & Pick<
      Event,
      'current_user_form_item_viewer_role' | 'current_user_form_item_writer_role'
    >,
>({
  convention,
  initialEvent,
  schedulingUi,
  imageAttachmentConfig,
}: UseEventFormWithCategorySelectionOptions<EventCategoryType, EventType>): UseEventFormWithCategorySelectionResult<
  EventType,
  EventCategoryType
> {
  const selectableCategoryIds = useMemo(() => {
    if (schedulingUi) {
      return convention.event_categories
        .filter((category) => category.scheduling_ui === schedulingUi)
        .map((category) => category.id);
    }

    return convention.event_categories.map((category) => category.id);
  }, [convention.event_categories, schedulingUi]);

  const [selectProps, { eventCategoryId, eventForm, eventCategory }] = useEventCategorySelection({
    convention,
    initialEventCategoryId: initialEvent.event_category?.id,
    selectableCategoryIds,
  });

  const [eventFormProps, eventFormHandles] = useEventForm({
    convention,
    initialEvent,
    eventForm,
    imageAttachmentConfig,
  });
  const { setEvent } = eventFormHandles;

  useEffect(() => {
    setEvent((prevEvent) => ({ ...prevEvent, event_category: eventCategory }));
  }, [eventCategory, setEvent]);

  return useMemo(
    () => [
      { selectProps, eventFormProps },
      {
        eventCategoryId,
        eventCategory,
        ...eventFormHandles,
      },
    ],
    [eventCategory, eventCategoryId, selectProps, eventFormProps, eventFormHandles],
  );
}

export type EventFormWithCategorySelectionProps<
  EventType extends FormResponse &
    Pick<Event, 'current_user_form_item_viewer_role' | 'current_user_form_item_writer_role'>,
> = {
  selectProps: EventCategorySelectProps;
  eventFormProps: EventFormProps<EventType>;
};

export function EventFormWithCategorySelection<EventType extends FormResponse>({
  selectProps,
  eventFormProps,
}: EventFormWithCategorySelectionProps<
  EventType & Pick<Event, 'current_user_form_item_viewer_role' | 'current_user_form_item_writer_role'>
>): React.JSX.Element {
  return (
    <>
      <EventCategorySelect {...selectProps} />
      <EventForm {...eventFormProps} />
    </>
  );
}
