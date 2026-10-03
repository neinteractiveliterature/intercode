# frozen_string_literal: true
require "test_helper"
require_relative "convention_permissions_test_helper"

class SignupChangePolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention, :with_notification_templates) }
  let(:signup) { create(:signup, run: create(:run, event: create(:event, convention:))) }
  let(:signup_change) { signup.log_signup_change!(action: "self_service_signup") }

  describe "#manage?" do
    it "is never allowed: signup changes are read-only once created" do
      assert_not SignupChangePolicy.new(create(:user, site_admin: true), signup_change).manage?
      assert_not SignupChangePolicy.new(
                   create_user_with_update_signups_in_convention(convention),
                   signup_change
                 ).manage?
      assert_not SignupChangePolicy.new(signup.user_con_profile.user, signup_change).manage?
    end
  end

  describe "#read?" do
    it "lets users with read_signup_details read signup changes" do
      user = create_user_with_read_signup_details_in_convention(convention)
      assert_policy_allows SignupChangePolicy, user, signup_change, :read?, convention
    end

    it "lets users read their own signup changes" do
      assert_policy_allows SignupChangePolicy, signup.user_con_profile.user, signup_change, :read?, convention
    end

    it "lets team members read signup changes for their events" do
      team_member = create(:team_member, event: signup.run.event)
      assert SignupChangePolicy.new(team_member.user_con_profile.user, signup_change).read?
    end

    it "does not let regular users read other people's signup changes" do
      assert_not SignupChangePolicy.new(create(:user), signup_change).read?
    end

    it "does not let anonymous users read signup changes" do
      assert_not SignupChangePolicy.new(nil, signup_change).read?
    end
  end
end
