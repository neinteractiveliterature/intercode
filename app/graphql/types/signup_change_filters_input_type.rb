class Types::SignupChangeFiltersInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :event_title, String, required: false, camelize: false
  argument :action, [String], required: false
end
