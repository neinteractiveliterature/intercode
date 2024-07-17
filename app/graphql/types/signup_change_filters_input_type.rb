# frozen_string_literal: true
class Types::SignupChangeFiltersInputType < Types::BaseInputObject
  argument :action, [String], required: false
  argument :event_title, String, required: false, camelize: false
  argument :name, String, required: false
end
