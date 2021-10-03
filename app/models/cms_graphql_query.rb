# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
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
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
class CmsGraphqlQuery < ApplicationRecord
  include Cadmus::Concerns::ModelWithParent
  model_with_parent

  validates :identifier, uniqueness: { scope: %i[parent_type parent_id] }
  validate :ensure_valid_query

  def execute(context:, variables:)
    IntercodeSchema.execute(query, variables: variables, context: context)
  end

  private

  def ensure_valid_query
    parsed_query = GraphQL::Query.new(IntercodeSchema.to_graphql, query)
    (parsed_query.static_errors + parsed_query.analysis_errors).each { |error| errors.add :query, error.message }

    return if parsed_query.query?
    errors.add :query, 'must be a GraphQL query (not a mutation or subscription)'
  end
end
