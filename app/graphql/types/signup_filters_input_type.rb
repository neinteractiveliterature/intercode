# frozen_string_literal: true
class Types::SignupFiltersInputType < Types::BaseInputObject
  argument :bucket, [String], required: false
  argument :email, String, required: false
  argument :name, String, required: false
  argument :state, [String], required: false
end
