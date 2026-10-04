# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"
require_relative "../../policies/convention_permissions_test_helper"

class Mutations::CreateUserConProfileTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention, :with_standard_content) }
  let(:new_attendee) { create(:user, first_name: "Newcomer", last_name: "Attendee") }
  let(:admin_user) do
    create_user_with_permissions_in_convention(%w[update_user_con_profiles read_user_con_profiles], convention)
  end
  let(:admin_profile) { admin_user.user_con_profiles.find_by!(convention:) }

  MUTATION = <<~GRAPHQL
    mutation TestCreateUserConProfile($userId: ID!, $userConProfile: UserConProfileInput!) {
      createUserConProfile(input: { userId: $userId, user_con_profile: $userConProfile }) {
        user_con_profile { id name needs_update }
      }
    }
  GRAPHQL

  def create_profile(as:, user: new_attendee, attrs: {})
    execute_graphql_query(
      MUTATION,
      user_con_profile: as,
      variables: {
        "userId" => user.id.to_s,
        "userConProfile" => {
          "form_response_attrs_json" => "{}",
          "first_name" => "Newcomer",
          "last_name" => "Attendee"
        }.merge(attrs)
      }
    )
  end

  it "lets users with update_user_con_profiles add an existing user as an attendee" do
    result = create_profile(as: admin_profile)

    profile = UserConProfile.find(result["data"]["createUserConProfile"]["user_con_profile"]["id"])
    assert_equal new_attendee, profile.user
    assert_equal convention, profile.convention
  end

  it "flags the new profile as needing the attendee's attention" do
    result = create_profile(as: admin_profile)

    assert result["data"]["createUserConProfile"]["user_con_profile"]["needs_update"]
  end

  it "saves the details the admin gives" do
    result = create_profile(as: admin_profile, attrs: { "nickname" => "Newbie", "city" => "Boston" })

    profile = UserConProfile.find(result["data"]["createUserConProfile"]["user_con_profile"]["id"])
    assert_equal "Newbie", profile.nickname
    assert_equal "Boston", profile.city
  end

  it "fills in details from the user's most recent profile at another convention" do
    older_convention = create(:convention, starts_at: 2.years.ago, ends_at: 2.years.ago + 3.days)
    create(:user_con_profile, convention: older_convention, user: new_attendee, city: "Providence", state: "RI")

    result = create_profile(as: admin_profile)

    profile = UserConProfile.find(result["data"]["createUserConProfile"]["user_con_profile"]["id"])
    assert_equal "Providence", profile.city
  end

  it "lets the admin's own details override the ones from the earlier profile" do
    older_convention = create(:convention, starts_at: 2.years.ago, ends_at: 2.years.ago + 3.days)
    create(:user_con_profile, convention: older_convention, user: new_attendee, city: "Providence")

    result = create_profile(as: admin_profile, attrs: { "city" => "Boston" })

    assert_equal "Boston", UserConProfile.find(result["data"]["createUserConProfile"]["user_con_profile"]["id"]).city
  end

  it "refuses to add someone who's already an attendee" do
    existing = create(:user_con_profile, convention:, user: new_attendee)

    error = assert_raises(GraphqlTestExecutionError) { create_profile(as: admin_profile) }

    assert_match(
      /#{Regexp.escape(existing.name)} is already an attendee of #{Regexp.escape(convention.name)}/,
      error.message
    )
    assert_equal 1, convention.user_con_profiles.where(user: new_attendee).count
  end

  it "returns an error for a user that doesn't exist" do
    assert_raises(GraphqlTestExecutionError) { create_profile(as: admin_profile, user: User.new(id: 0)) }
  end

  it "doesn't let regular attendees add people" do
    regular = create(:user_con_profile, convention:)

    error = assert_raises(GraphqlTestExecutionError) { create_profile(as: regular) }

    assert_match(/Unauthorized mutation/, error.message)
    assert_not convention.user_con_profiles.exists?(user: new_attendee)
  end

  it "doesn't let attendees add themselves to another convention this way" do
    other_convention = create(:convention, :with_standard_content)
    own_profile = create(:user_con_profile, convention: other_convention)

    assert_raises(GraphqlTestExecutionError) { create_profile(as: own_profile, user: own_profile.user) }
    assert_equal 1, own_profile.user.user_con_profiles.count
  end

  it "doesn't let users with only read_user_con_profiles add people" do
    reader = create_user_with_read_user_con_profiles_in_convention(convention).user_con_profiles.find_by!(convention:)

    assert_raises(GraphqlTestExecutionError) { create_profile(as: reader) }
    assert_not convention.user_con_profiles.exists?(user: new_attendee)
  end

  it "doesn't let admins from another convention add people" do
    other_admin = create_user_with_update_user_con_profiles_in_convention(create(:convention)).user_con_profiles.first

    assert_raises(GraphqlTestExecutionError) { create_profile(as: other_admin) }
    assert_not convention.user_con_profiles.exists?(user: new_attendee)
  end
end
# rubocop:enable GraphQL/ObjectDescription
