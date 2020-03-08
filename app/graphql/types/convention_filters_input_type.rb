class Types::ConventionFiltersInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :organization_name, String, required: false, camelize: false
end
