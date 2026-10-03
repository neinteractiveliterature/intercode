# frozen_string_literal: true
require "test_helper"
require_relative "convention_permissions_test_helper"

class RankedChoiceDecisionPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) do
    create(:convention, :with_notification_templates, signup_mode: "moderated", signup_automation_mode: "ranked_choice")
  end
  let(:signup_round) { create(:signup_round, convention: convention) }
  let(:signup_ranked_choice) do
    create(:signup_ranked_choice, target_run: create(:run, event: create(:event, convention: convention)))
  end
  let(:decision) do
    RankedChoiceDecision.create!(
      user_con_profile: signup_ranked_choice.user_con_profile,
      signup_round: signup_round,
      signup_ranked_choice: signup_ranked_choice,
      decision: "skip_user",
      reason: "no_pending_choices"
    )
  end

  describe "#read?" do
    it "lets users with update_signups read decisions in a ranked-choice convention" do
      user = create_user_with_update_signups_in_convention(convention)
      assert_policy_allows RankedChoiceDecisionPolicy, user, decision, :read?, convention
    end

    it "does not let users with update_signups read decisions if the convention is not ranked-choice" do
      convention.update!(signup_automation_mode: "none")
      user = create_user_with_update_signups_in_convention(convention)
      assert_not RankedChoiceDecisionPolicy.new(user, decision).read?
    end

    it "does not let the affected user read their own decision" do
      assert_not RankedChoiceDecisionPolicy.new(decision.user_con_profile.user, decision).read?
    end

    it "lets site admins read decisions" do
      assert RankedChoiceDecisionPolicy.new(create(:user, site_admin: true), decision).read?
    end
  end

  describe "#manage?" do
    it "is never allowed, even for users with update_signups" do
      user = create_user_with_update_signups_in_convention(convention)
      assert_not RankedChoiceDecisionPolicy.new(user, decision).manage?
    end

    it "is never allowed for site admins" do
      assert_not RankedChoiceDecisionPolicy.new(create(:user, site_admin: true), decision).manage?
    end
  end

  describe "Scope" do
    it "returns decisions in ranked-choice cons where you have update_signups" do
      decision
      user = create_user_with_update_signups_in_convention(convention)

      resolved = RankedChoiceDecisionPolicy::Scope.new(user, RankedChoiceDecision.all).resolve
      assert_equal [decision], resolved.to_a
    end

    it "does not return decisions for regular users" do
      decision
      resolved = RankedChoiceDecisionPolicy::Scope.new(decision.user_con_profile.user, RankedChoiceDecision.all).resolve
      assert_equal [], resolved.to_a
    end

    it "returns everything to site admins" do
      decision
      resolved =
        RankedChoiceDecisionPolicy::Scope.new(create(:user, site_admin: true), RankedChoiceDecision.all).resolve
      assert_equal [decision], resolved.to_a
    end

    it "restricts identity assumers to the assumed convention" do
      decision
      user = create_user_with_update_signups_in_convention(convention)

      same =
        RankedChoiceDecisionPolicy::Scope.new(
          create_identity_assumer(user, convention),
          RankedChoiceDecision.all
        ).resolve
      other =
        RankedChoiceDecisionPolicy::Scope.new(
          create_identity_assumer_from_other_convention(user),
          RankedChoiceDecision.all
        ).resolve

      assert_equal [decision], same.to_a
      assert_equal [], other.to_a
    end
  end
end
