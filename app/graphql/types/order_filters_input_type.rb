# frozen_string_literal: true
class Types::OrderFiltersInputType < Types::BaseInputObject
  argument :id, ID, required: false, camelize: false
  argument :status, [String], required: false
  argument :user_name, String, required: false, camelize: false
end
