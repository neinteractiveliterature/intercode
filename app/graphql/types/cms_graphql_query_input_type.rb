# frozen_string_literal: true
class Types::CmsGraphqlQueryInputType < Types::BaseInputObject
  argument :identifier, String, required: false
  argument :query, String, required: false
  argument :admin_notes, String, required: false, camelize: false
end
