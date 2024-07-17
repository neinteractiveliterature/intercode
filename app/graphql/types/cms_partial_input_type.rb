# frozen_string_literal: true
class Types::CmsPartialInputType < Types::BaseInputObject
  argument :admin_notes, String, required: false, camelize: false
  argument :content, String, required: false
  argument :name, String, required: false
end
