# frozen_string_literal: true
class Types::OrderFiltersInputType < Types::BaseInputObject
  argument :id, String, required: false, camelize: false
  argument :user_name, String, required: false, camelize: false
  argument :status, [String], required: false
end
