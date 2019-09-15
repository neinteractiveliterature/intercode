class Types::CmsContentInputType < Types::BaseInputObject
  argument :id, Int, required: true
  argument :content_type, Types::CmsContentTypeIndicator, required: true, camelize: false
end
