# frozen_string_literal: true
class Types::EventProposalInputType < Types::BaseInputObject
  argument :form_response_attrs_json, String, required: false, camelize: false
end
