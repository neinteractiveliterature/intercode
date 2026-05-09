# Read about factories at https://github.com/thoughtbot/factory_bot

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
FactoryBot.define do
  factory :oauth_application, class: "OAuthApplication" do
    sequence(:name) { |n| "Application #{n}" }
    redirect_uri { "https://butt.holdings" }
  end
end
