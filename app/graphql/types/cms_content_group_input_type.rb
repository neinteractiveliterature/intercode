# frozen_string_literal: true
class Types::CmsContentGroupInputType < Types::BaseInputObject
  argument :contents, [Types::CmsContentInputType], required: false
  argument :name, String, required: false
end
