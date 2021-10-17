# frozen_string_literal: true
class Types::CmsContentGroupInputType < Types::BaseInputObject
  argument :name, String, required: false
  argument :contents, [Types::CmsContentInputType], required: false
end
