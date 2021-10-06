# frozen_string_literal: true
class Types::EventInputType < Types::BaseInputObject
  argument :event_category_id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_event_category_id, ID, required: false, camelize: true
  argument :form_response_attrs_json, String, required: false, camelize: false
end
