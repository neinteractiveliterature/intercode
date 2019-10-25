class Types::EventFiltersInputType < Types::BaseInputObject
  argument :category, [Integer, null: true], required: false
  argument :title, String, required: false
  argument :title_prefix, String, required: false, camelize: false
  argument :my_rating, [Integer], required: false, camelize: false
end
