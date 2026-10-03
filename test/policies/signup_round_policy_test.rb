# frozen_string_literal: true
require "test_helper"
require_relative "convention_permissions_test_helper"

class SignupRoundPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention, signup_mode: "moderated", signup_automation_mode: "ranked_choice") }
  let(:signup_round) { create(:signup_round, convention:) }

  describe "#read?" do
    it "lets anyone read signup rounds, even anonymous users" do
      assert SignupRoundPolicy.new(nil, signup_round).read?
      assert SignupRoundPolicy.new(create(:user), signup_round).read?
    end
  end

  describe "#manage?" do
    it "lets users with update_convention manage signup rounds" do
      user = create_user_with_update_convention_in_convention(convention)
      assert_policy_allows SignupRoundPolicy, user, signup_round, :manage?, convention
    end

    it "does not let users with only update_signups manage signup rounds" do
      user = create_user_with_update_signups_in_convention(convention)
      assert_not SignupRoundPolicy.new(user, signup_round).manage?
    end

    it "does not let regular users manage signup rounds" do
      assert_not SignupRoundPolicy.new(create(:user_con_profile, convention:).user, signup_round).manage?
    end

    it "lets site admins manage signup rounds" do
      assert SignupRoundPolicy.new(create(:user, site_admin: true), signup_round).manage?
    end
  end

  describe "#rerun?" do
    it "lets users with update_signups rerun signup rounds in a moderated-signup convention" do
      user = create_user_with_update_signups_in_convention(convention)
      assert_policy_allows SignupRoundPolicy, user, signup_round, :rerun?, convention
    end

    it "does not let users with update_signups rerun signup rounds in a self-service convention" do
      convention.update!(signup_mode: "self_service", signup_automation_mode: "none")
      user = create_user_with_update_signups_in_convention(convention)

      assert_not SignupRoundPolicy.new(user, signup_round).rerun?
    end

    it "does not let site admins rerun signup rounds in a self-service convention" do
      convention.update!(signup_mode: "self_service", signup_automation_mode: "none")

      assert_not SignupRoundPolicy.new(create(:user, site_admin: true), signup_round).rerun?
    end

    it "does not let users with only update_convention rerun signup rounds" do
      user = create_user_with_update_convention_in_convention(convention)
      assert_not SignupRoundPolicy.new(user, signup_round).rerun?
    end

    it "lets site admins rerun signup rounds in a moderated-signup convention" do
      assert SignupRoundPolicy.new(create(:user, site_admin: true), signup_round).rerun?
    end
  end

  describe "Scope" do
    it "returns all signup rounds to anyone" do
      signup_round
      assert_equal SignupRound.all.to_a.sort, SignupRoundPolicy::Scope.new(nil, SignupRound.all).resolve.to_a.sort
      assert_includes SignupRoundPolicy::Scope.new(nil, SignupRound.all).resolve, signup_round
    end
  end
end
