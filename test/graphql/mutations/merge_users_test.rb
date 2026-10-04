# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"
require_relative "../../policies/convention_permissions_test_helper"

class Mutations::MergeUsersTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention1) { create(:convention) }
  let(:convention2) { create(:convention) }
  let(:winning_user) { create(:user) }
  let(:losing_user) { create(:user) }
  let(:winning_profile) { create(:user_con_profile, convention: convention1, user: winning_user) }
  let(:losing_profile) { create(:user_con_profile, convention: convention2, user: losing_user) }
  let(:site_admin_profile) { create(:user_con_profile, convention: convention1, user: create(:site_admin)) }

  before do
    winning_profile
    losing_profile
  end

  MUTATION = <<~GRAPHQL
    mutation TestMergeUsers($userIds: [ID!], $winningUserId: ID, $winningUserConProfiles: [WinningUserConProfileInput!]!) {
      mergeUsers(input: { userIds: $userIds, winningUserId: $winningUserId, winningUserConProfiles: $winningUserConProfiles }) {
        user { id }
      }
    }
  GRAPHQL

  def merge(as:, user_ids: [winning_user.id, losing_user.id], winning_user_id: winning_user.id, winning_profiles: [])
    execute_graphql_query(
      MUTATION,
      user_con_profile: as,
      variables: {
        "userIds" => user_ids&.map(&:to_s),
        "winningUserId" => winning_user_id&.to_s,
        "winningUserConProfiles" =>
          winning_profiles.map do |profile|
            { "conventionId" => profile.convention_id.to_s, "userConProfileId" => profile.id.to_s }
          end
      }
    )
  end

  it "lets site admins merge users, keeping every convention's profile for the winning user" do
    result = merge(as: site_admin_profile)

    assert_equal winning_user.id.to_s, result["data"]["mergeUsers"]["user"]["id"]
    assert_not User.exists?(losing_user.id)
    assert_equal [convention1.id, convention2.id].sort, winning_user.reload.user_con_profiles.pluck(:convention_id).sort
    assert_equal winning_user, losing_profile.reload.user
  end

  it "needs to be told which profile wins when both users attended the same convention" do
    create(:user_con_profile, convention: convention1, user: losing_user)

    error = assert_raises(GraphqlTestExecutionError) { merge(as: site_admin_profile) }

    assert_match(/is not disambiguated/, error.message)
    assert User.exists?(losing_user.id)
  end

  it "merges the profiles for a convention both users attended, into the chosen winner" do
    duplicate_profile = create(:user_con_profile, convention: convention1, user: losing_user)
    signup = create(:signup, user_con_profile: duplicate_profile)

    merge(as: site_admin_profile, winning_profiles: [winning_profile])

    assert_not UserConProfile.exists?(duplicate_profile.id)
    assert_equal winning_profile, signup.reload.user_con_profile
  end

  it "gives the winning user site admin rights if any of the merged users had them" do
    losing_user.update!(site_admin: true)

    merge(as: site_admin_profile)

    assert winning_user.reload.site_admin?
  end

  it "won't treat a profile that belongs to nobody being merged as a winner" do
    stranger_profile = create(:user_con_profile, convention: convention1)

    error =
      assert_raises(GraphqlTestExecutionError) { merge(as: site_admin_profile, winning_profiles: [stranger_profile]) }

    assert_match(/Can't find user con profile/, error.message)
    assert User.exists?(losing_user.id)
  end

  it "requires the winning user to be one of the users being merged" do
    third_user = create(:user)

    error = assert_raises(GraphqlTestExecutionError) { merge(as: site_admin_profile, winning_user_id: third_user.id) }

    assert_match(/Winning user ID is not included in user IDs/, error.message)
    assert User.exists?(losing_user.id)
  end

  it "doesn't let convention admins merge users, even their own attendees" do
    admin = create_user_with_permissions_in_convention(%w[update_user_con_profiles read_user_con_profiles], convention1)

    error = assert_raises(GraphqlTestExecutionError) { merge(as: admin.user_con_profiles.first) }

    assert_match(/Unauthorized mutation/, error.message)
    assert User.exists?(losing_user.id)
  end

  it "doesn't let the users being merged merge themselves" do
    error = assert_raises(GraphqlTestExecutionError) { merge(as: winning_profile) }

    assert_match(/Unauthorized mutation/, error.message)
    assert User.exists?(losing_user.id)
  end

  it "doesn't let a user merge someone who isn't a site admin along with a user the caller can manage" do
    # authorization is checked for every user being merged, so listing extra users can't smuggle them in
    admin = create_user_with_permissions_in_convention(%w[update_user_con_profiles], convention1)

    assert_raises(GraphqlTestExecutionError) do
      merge(as: admin.user_con_profiles.first, user_ids: [admin.id, losing_user.id], winning_user_id: admin.id)
    end
    assert User.exists?(losing_user.id)
  end
end
# rubocop:enable GraphQL/ObjectDescription
