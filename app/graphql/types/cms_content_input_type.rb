# frozen_string_literal: true
class Types::CmsContentInputType < Types::BaseInputObject
  argument :id,
           Int,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :content_type, Types::CmsContentTypeIndicator, required: true, camelize: false
end
