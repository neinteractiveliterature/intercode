import { EventPageQueryQuery } from '../EventsApp/EventPage/queries.generated';
import { FormType, EventCategory, Form } from '../graphqlTypes.generated';

const BLANK_FORM: NonNullable<EventPageQueryQuery['event']['form']> = {
  id: 0,
  title: '',
  form_type: FormType.Event,
  form_sections: [],
};

type EventCategoryFormData = Pick<EventCategory, 'id' | 'event_form' | 'event_proposal_form'>;
export type ConventionForEventCategoryForms = {
  event_categories: EventCategoryFormData[],
};

function getFormDataForEventCategoryId(
  eventCategoryId: number | undefined | null,
  convention: ConventionForEventCategoryForms,
  getData: (eventCategory: EventCategoryFormData) => Form | null | undefined,
) {
  if (!eventCategoryId) {
    return { form: BLANK_FORM };
  }

  const eventCategory = convention.event_categories.find((c) => c.id === eventCategoryId);
  if (eventCategory) {
    return getData(eventCategory) ?? { form: BLANK_FORM };
  }
  return { form: BLANK_FORM };
}

export function getEventFormForEventCategoryId(
  eventCategoryId: number | undefined | null,
  convention: ConventionForEventCategoryForms,
) {
  return getFormDataForEventCategoryId(
    eventCategoryId,
    convention,
    (eventCategory) => eventCategory.event_form,
  );
}

export function getProposalFormForEventCategoryId(
  eventCategoryId: number | undefined | null,
  convention: ConventionForEventCategoryForms,
) {
  return getFormDataForEventCategoryId(
    eventCategoryId,
    convention,
    (eventCategory) => eventCategory.event_proposal_form,
  );
}
