# frozen_string_literal: true
class Mutations::CreateOAuthApplication < Mutations::BaseMutation
  description "Creates a new OAuth2 application. Returns the plaintext secret once; it cannot be retrieved again."

  field :oauth_application,
        Types::OAuthApplicationType,
        null: false,
        description: "The newly created OAuth2 application."
  field :secret,
        String,
        null: false,
        description: "The plaintext client secret. Store it now; it will not be shown again."

  argument :oauth_application,
           Types::OAuthApplicationInputType,
           required: true,
           camelize: false,
           description: "Attributes for the new OAuth2 application."

  define_authorization_check { |_args| policy(OAuthApplication.new).create? }

  def resolve(**args)
    attrs = args[:oauth_application].to_h
    attrs[:scopes] = attrs[:scopes].join(" ") if attrs.key?(:scopes)
    application = OAuthApplication.new(attrs)
    application.save!

    { oauth_application: application, secret: application.plaintext_secret }
  end
end
