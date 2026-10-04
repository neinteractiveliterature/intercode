# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"
require_relative "../../policies/convention_permissions_test_helper"

class Mutations::CreateUserConProfileTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:organization) { create(:organization) }
  let(:convention) { create(:convention, :with_standard_content, organization:) }
  let(:older_convention) do
    create(:convention, :with_standard_content, organization:, starts_at: 2.years.ago, ends_at: 2.years.ago + 3.days)
  end
  let(:new_attendee) { create(:user, first_name: "Newcomer", last_name: "Attendee") }
  let(:earlier_profile) do
    create(:user_con_profile, convention: older_convention, user: new_attendee, city: "Providence", state: "RI")
  end

  # Staff who can add attendees to the convention, but have no special visibility of other conventions' users
  let(:staff_user) do
    create_user_with_permissions_in_convention(%w[update_user_con_profiles read_user_con_profiles], convention)
  end
  let(:staff_profile) { staff_user.user_con_profiles.find_by!(convention:) }

  # The same staff, who can also see the users of the organization's conventions
  let(:org_staff_profile) do
    role = organization.organization_roles.create!(name: "Reader", users: [staff_user])
    role.permissions.create!(permission: "read_convention_users")
    staff_profile
  end

  let(:site_admin_profile) { create(:user_con_profile, convention:, user: create(:site_admin)) }

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

  def created_profile(result)
    UserConProfile.find(result["data"]["createUserConProfile"]["user_con_profile"]["id"])
  end

  describe "for users the caller can see" do
    it "lets site admins add any user as an attendee" do
      profile = created_profile(create_profile(as: site_admin_profile))

      assert_equal new_attendee, profile.user
      assert_equal convention, profile.convention
    end

    it "lets staff with update_user_con_profiles add users from their organization's conventions" do
      earlier_profile

      profile = created_profile(create_profile(as: org_staff_profile))

      assert_equal new_attendee, profile.user
      assert_equal convention, profile.convention
    end

    it "flags the new profile as needing the attendee's attention" do
      result = create_profile(as: site_admin_profile)

      assert result["data"]["createUserConProfile"]["user_con_profile"]["needs_update"]
    end

    it "saves the details the admin gives" do
      profile =
        created_profile(create_profile(as: site_admin_profile, attrs: { "nickname" => "Newbie", "city" => "Boston" }))

      assert_equal "Newbie", profile.nickname
      assert_equal "Boston", profile.city
    end

    it "fills in details from the user's most recent profile at another convention" do
      earlier_profile

      assert_equal "Providence", created_profile(create_profile(as: org_staff_profile)).city
    end

    it "lets the admin's own details override the ones from the earlier profile" do
      earlier_profile

      assert_equal "Boston", created_profile(create_profile(as: org_staff_profile, attrs: { "city" => "Boston" })).city
    end

    it "refuses to add someone who's already an attendee" do
      existing = create(:user_con_profile, convention:, user: new_attendee)

      error = assert_raises(GraphqlTestExecutionError) { create_profile(as: site_admin_profile) }

      assert_match(
        /#{Regexp.escape(existing.name)} is already an attendee of #{Regexp.escape(convention.name)}/,
        error.message
      )
      assert_equal 1, convention.user_con_profiles.where(user: new_attendee).count
    end

    it "returns an error for a user that doesn't exist" do
      assert_raises(GraphqlTestExecutionError) { create_profile(as: site_admin_profile, user: User.new(id: 0)) }
    end
  end

  describe "for users the caller can't see" do
    it "doesn't let staff add users who have no profile in their organization's conventions" do
      other_convention = create(:convention, :with_standard_content)
      create(:user_con_profile, convention: other_convention, user: new_attendee, city: "Providence", state: "RI")

      assert_raises(GraphqlTestExecutionError) { create_profile(as: org_staff_profile) }
      assert_not convention.user_con_profiles.exists?(user: new_attendee)
    end

    it "doesn't let staff without organization access add users (and see details from other conventions)" do
      earlier_profile

      assert_raises(GraphqlTestExecutionError) { create_profile(as: staff_profile) }
      assert_not convention.user_con_profiles.exists?(user: new_attendee)
    end
  end

  describe "authorization" do
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
end
# rubocop:enable GraphQL/ObjectDescription
