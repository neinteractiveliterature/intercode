# frozen_string_literal: true
class Types::EventProposalInputType < Types::BaseInputObject
  argument :add_image_blob_ids, [ID], required: false, camelize: true
  argument :form_response_attrs_json, String, required: false, camelize: false
  argument :remove_image_blob_ids, [ID], required: false, camelize: true
end
