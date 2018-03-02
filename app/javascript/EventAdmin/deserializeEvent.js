export default function deserializeEvent(event) {
  return {
    ...event,
    form_response_attrs: JSON.parse(event.form_response_attrs_json),
  };
}
