class Types::OrderFiltersInputType < Types::BaseInputObject
  argument :user_name, String, required: false, camelize: false
  argument :status, [String], required: false
end
