class OAuthApplication < ApplicationRecord
  include ::Doorkeeper::Orm::ActiveRecord::Mixins::Application

  self.table_name = "oauth_applications"

  def redirect_uri
    return super unless is_intercode_frontend?

    [*Convention.pluck(:domain), ENV.fetch("INTERCODE_HOST", nil)].compact
      .map do |host|
        host = "#{host}:3135" if Rails.env.development?
        "https://#{host}/oauth/callback"
      end
      .join("\n")
  end
end
