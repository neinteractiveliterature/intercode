import EventCategory from './EventCategory';
import Form from '../Models/Form';

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
  const jsonForForm = getFormDataForEventCategory(event, convention).form_api_json;
  return Form.fromApiResponse(JSON.parse(jsonForForm));
}
