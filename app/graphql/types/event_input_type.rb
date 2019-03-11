class Types::EventInputType < Types::BaseInputObject
  argument :event_category_id, Integer, required: false, camelize: false
  argument :form_response_attrs_json, String, required: false, camelize: false
end
