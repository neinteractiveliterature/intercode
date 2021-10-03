# frozen_string_literal: true
class Types::CmsLayoutInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :content, String, required: false
  argument :navbar_classes, String, required: false, camelize: false
  argument :admin_notes, String, required: false, camelize: false
end
