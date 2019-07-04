# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :cms_graphql_query do
    sequence(:identifier) { |n| "graphql_query_#{n}" }
    query { 'query { convention { id } }' }
    association :parent, factory: :convention
  end
end
