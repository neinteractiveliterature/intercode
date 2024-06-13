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
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
require "test_helper"

class CmsGraphqlQueryTest < ActiveSupport::TestCase
  let(:parent) { create(:convention) }

  describe "query execution" do
    it "executes a query" do
      query = CmsGraphqlQuery.create!(parent:, query: <<~GRAPHQL)
        query {
          convention: conventionByRequestHost {
            name
          }
        }
      GRAPHQL

      results = query.execute(context: { convention: parent }, variables: {})
      assert_equal parent.name, results.to_h["data"]["convention"]["name"]
    end
  end

  describe "query validation" do
    it "validates a valid query" do
      query = CmsGraphqlQuery.new(parent:, query: <<~GRAPHQL)
        query {
          convention: conventionByRequestHost {
            my_profile {
              id
            }
          }
        }
      GRAPHQL

      assert query.valid?
    end

    it "rejects an invalid query" do
      query = CmsGraphqlQuery.new(parent:, query: "invalidquerystring")
      refute query.valid?
    end

    it "rejects a valid mutation" do
      Rails.backtrace_cleaner.remove_silencers!
      query = CmsGraphqlQuery.new(parent:, query: <<~GRAPHQL)
        mutation($id: ID!) {
          dropEvent(id: $id) {
            clientMutationId
          }
        }
      GRAPHQL

      refute query.valid?
      assert_match(/must be a GraphQL query/, query.errors.full_messages.join("\n"))
    end
  end
end
