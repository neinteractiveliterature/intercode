class Types::UserFiltersInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :email, String, required: false
  argument :privileges, [String], required: false
end
