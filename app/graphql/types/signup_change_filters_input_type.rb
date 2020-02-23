class Types::SignupChangeFiltersInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :state, [String], required: false
  argument :bucket, [String], required: false
end
