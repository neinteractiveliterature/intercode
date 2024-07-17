# frozen_string_literal: true
class Types::CmsContentInputType < Types::BaseInputObject
  argument :content_type, Types::CmsContentTypeIndicator, required: true, camelize: false
  argument :id, ID, required: false
end
