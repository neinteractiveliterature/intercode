class OAuthApplication < ApplicationRecord
  include ::Doorkeeper::Orm::ActiveRecord::Mixins::Application

  self.table_name = "oauth_applications"

  def redirect_uri
    return super unless is_intercode_frontend?

    assets_port =
      if (match = ENV["ASSETS_HOST"].match(/:(\d+)\Z/))
        match[1]
      end

    [*Convention.pluck(:domain), ENV.fetch("INTERCODE_HOST", nil)].compact
      .map do |host|
        host = "#{host}:#{assets_port}" if assets_port.present?
        "https://#{host}/oauth/callback"
      end
      .join("\n")
  end
end
