import { deserializeForm } from '../FormPresenter/GraphQLFormDeserialization';

function getFormDataForEventCategory(event, convention) {
  const eventCategory = convention.event_categories.find(c => c.id === event.event_category.id);
  return eventCategory.event_form;
}

export default function getFormForEventCategory(event, convention) {
  return deserializeForm(getFormDataForEventCategory(event, convention));
}
