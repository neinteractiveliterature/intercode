# frozen_string_literal: true
class Types::UserFiltersInputType < Types::BaseInputObject
  argument :email, String, required: false
  argument :first_name, String, required: false, camelize: false
  argument :last_name, String, required: false, camelize: false
  argument :name, String, required: false
  argument :privileges, [String], required: false
end
