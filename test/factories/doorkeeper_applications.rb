# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :doorkeeper_application, class: Doorkeeper::Application do
    sequence(:name) { |n| "Application #{n}" }
    redirect_uri { 'https://butt.holdings' }
  end
end
