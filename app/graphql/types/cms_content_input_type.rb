# frozen_string_literal: true
class Types::CmsContentInputType < Types::BaseInputObject
  argument :id, ID, required: false
  argument :content_type, Types::CmsContentTypeIndicator, required: true, camelize: false
end
