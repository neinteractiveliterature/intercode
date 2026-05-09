# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: oauth_applications
#
#  id                    :bigint           not null, primary key
#  confidential          :boolean          default(TRUE), not null
#  is_intercode_frontend :boolean          default(FALSE), not null
#  name                  :string           not null
#  redirect_uri          :text
#  scopes                :string           default(""), not null
#  secret                :string           not null
#  uid                   :string           not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#
# Indexes
#
#  index_oauth_applications_on_is_intercode_frontend  (is_intercode_frontend) UNIQUE WHERE is_intercode_frontend
#  index_oauth_applications_on_uid                    (uid) UNIQUE
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
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
