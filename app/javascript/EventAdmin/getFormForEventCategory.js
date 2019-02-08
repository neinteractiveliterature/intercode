import { deserializeForm } from '../FormPresenter/GraphQLFormDeserialization';

const BLANK_FORM_API_JSON = JSON.stringify({
  form_sections: [],
  form_items: [],
});

function getFormDataForEventCategory(event, convention) {
  if (!event.event_category) {
    return { form_api_json: BLANK_FORM_API_JSON };
  }

  const eventCategory = convention.event_categories.find(c => c.id === event.event_category.id);
  if (eventCategory) {
    return eventCategory.event_form;
  }
  return { form_api_json: BLANK_FORM_API_JSON };
}

export default function getFormForEventCategory(event, convention) {
  return deserializeForm(getFormDataForEventCategory(event, convention));
}
