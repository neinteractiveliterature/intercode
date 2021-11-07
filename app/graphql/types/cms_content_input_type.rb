# frozen_string_literal: true
class Types::CmsContentInputType < Types::BaseInputObject
  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :content_type, Types::CmsContentTypeIndicator, required: true, camelize: false
end
