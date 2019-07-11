# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :root_site do
    site_name { 'The Root Site' }
    association :root_page, factory: :page
    association :default_layout, factory: :cms_layout
  end
end
