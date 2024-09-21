require "test_helper"

class Queries::AppRootQueryTest < ActiveSupport::TestCase
  let(:convention) { create(:convention, :with_standard_content) }
  let(:user_con_profile) { create(:user_con_profile, convention:) }

  before { create(:root_site) }

  it "executes on the root page" do
    query = GraphqlOperation.find("AppRootQuery").to_query_string
    result = execute_graphql_query(query, user_con_profile:, variables: { path: "/" })
    data = result.to_h["data"]

    assert_equal convention.id.to_s, data["convention"]["id"]
    assert_equal user_con_profile.id.to_s, data["convention"]["my_profile"]["id"]
  end
end
