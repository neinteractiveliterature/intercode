# frozen_string_literal: true
class Types::RunFiltersInputType < Types::BaseInputObject
  argument :category, [Integer, { null: true }], required: false
  argument :form_items, GraphQL::Types::JSON, required: false, camelize: false
  argument :my_rating, [Integer], required: false, camelize: false
  argument :title, String, required: false
  argument :title_prefix, String, required: false, camelize: false
end
