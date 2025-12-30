# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :oauth_application, class: "OAuthApplication" do
    sequence(:name) { |n| "Application #{n}" }
    redirect_uri { "https://butt.holdings" }
  end
end
