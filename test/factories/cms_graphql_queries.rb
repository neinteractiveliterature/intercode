# == Schema Information
#
# Table name: cms_graphql_queries
#
#  id          :bigint           not null, primary key
#  admin_notes :text
#  identifier  :text
#  parent_type :string
#  query       :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :bigint
#
# Indexes
#
#  index_cms_graphql_queries_on_parent_type_and_parent_id  (parent_type,parent_id)
#

FactoryBot.define do
  factory :cms_graphql_query do
    sequence(:identifier) { |n| "graphql_query_#{n}" }
    query { 'query { convention { id } }' }
    association :parent, factory: :convention
  end
end
