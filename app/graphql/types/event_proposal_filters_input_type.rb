# frozen_string_literal: true
class Types::EventProposalFiltersInputType < Types::BaseInputObject
  argument :title, String, required: false
  argument :owner, String, required: false
  argument :status, [String, { null: true }], required: false
  argument :event_category, [Integer, { null: true }], required: false, camelize: false
end
