# frozen_string_literal: true
class Types::CmsPartialInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :content, String, required: false
  argument :admin_notes, String, required: false, camelize: false
end
