import EventCategory from './EventCategory';
import { deserializeForm } from '../FormPresenter/GraphQLFormDeserialization';

function getFormDataForEventCategory(event, convention) {
  const category = EventCategory.get(event.category);

  if (category.isRecurring()) {
    return convention.volunteer_event_form;
  }

  if (category.isSingleRun()) {
    return convention.filler_event_form;
  }

  return convention.regular_event_form;
}

export default function getFormForEventCategory(event, convention) {
  return deserializeForm(getFormDataForEventCategory(event, convention));
}
