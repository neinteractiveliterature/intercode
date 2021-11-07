# frozen_string_literal: true
class Types::EventInputType < Types::BaseInputObject
  argument :transitional_event_category_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the eventCategoryId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :event_category_id, ID, required: false, camelize: true
  argument :form_response_attrs_json, String, required: false, camelize: false
end
