# frozen_string_literal: true
class Types::OAuthApplicationInputType < Types::BaseInputObject
  description "Input for creating or updating an OAuth2 application."

  argument :confidential,
           Boolean,
           required: false,
           description: "Whether the application can keep its client secret confidential."
  argument :name, String, required: false, description: "The display name of the application."
  argument :redirect_uri,
           String,
           required: false,
           camelize: false,
           description: "The allowed redirect URI(s), one per line."
  argument :scopes, [String], required: false, description: "The OAuth scopes this application is allowed to request."
end
