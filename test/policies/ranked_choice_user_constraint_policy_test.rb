# frozen_string_literal: true
require "test_helper"
require_relative "convention_permissions_test_helper"

class RankedChoiceUserConstraintPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) do
    create(:convention, :with_notification_templates, signup_mode: "moderated", signup_automation_mode: "ranked_choice")
  end
  let(:user_con_profile) { create(:user_con_profile, convention: convention) }
  let(:constraint) { create(:ranked_choice_user_constraint, user_con_profile: user_con_profile) }
  let(:owner) { user_con_profile.user }

  describe "#read?" do
    it "lets users with update_signups read constraints in a ranked-choice convention" do
      user = create_user_with_update_signups_in_convention(convention)
      assert_policy_allows RankedChoiceUserConstraintPolicy, user, constraint, :read?, convention
    end

    it "does not let users with update_signups read constraints if the convention is not ranked-choice" do
      convention.update!(signup_automation_mode: "none")
      user = create_user_with_update_signups_in_convention(convention)
      assert_not RankedChoiceUserConstraintPolicy.new(user, constraint).read?
    end

    it "lets users read their own constraints" do
      assert_policy_allows RankedChoiceUserConstraintPolicy, owner, constraint, :read?, convention
    end

    it "does not let users read other people's constraints" do
      assert_not RankedChoiceUserConstraintPolicy.new(create(:user), constraint).read?
    end

    it "lets site admins read constraints" do
      assert RankedChoiceUserConstraintPolicy.new(create(:user, site_admin: true), constraint).read?
    end
  end

  describe "#manage?" do
    it "lets users with update_signups manage constraints in a ranked-choice convention" do
      user = create_user_with_update_signups_in_convention(convention)
      assert_policy_allows RankedChoiceUserConstraintPolicy, user, constraint, :manage?, convention
    end

    it "does not let users with update_signups manage constraints if the convention is not ranked-choice" do
      convention.update!(signup_automation_mode: "none")
      user = create_user_with_update_signups_in_convention(convention)
      assert_not RankedChoiceUserConstraintPolicy.new(user, constraint).manage?
    end

    it "lets users manage their own constraints in a ranked-choice convention" do
      assert_policy_allows RankedChoiceUserConstraintPolicy, owner, constraint, :manage?, convention
    end

    it "does not let users manage their own constraints if the convention is not ranked-choice" do
      convention.update!(signup_automation_mode: "none")
      assert_not RankedChoiceUserConstraintPolicy.new(owner, constraint).manage?
    end

    it "does not let users manage other people's constraints" do
      assert_not RankedChoiceUserConstraintPolicy.new(create(:user), constraint).manage?
    end
  end

  describe "Scope" do
    it "returns all constraints in ranked-choice cons where you have update_signups" do
      create(:ranked_choice_user_constraint, user_con_profile: create(:user_con_profile))
      user = create_user_with_update_signups_in_convention(convention)
      constraint

      resolved = RankedChoiceUserConstraintPolicy::Scope.new(user, RankedChoiceUserConstraint.all).resolve
      assert_equal [constraint], resolved.to_a
    end

    it "does not return constraints from non-ranked-choice cons where you have update_signups" do
      constraint
      convention.update!(signup_automation_mode: "none")
      user = create_user_with_update_signups_in_convention(convention)

      assert_equal [], RankedChoiceUserConstraintPolicy::Scope.new(user, RankedChoiceUserConstraint.all).resolve.to_a
    end

    it "returns a regular user's own constraints" do
      create(:ranked_choice_user_constraint, user_con_profile: create(:user_con_profile, convention: convention))

      resolved = RankedChoiceUserConstraintPolicy::Scope.new(owner, RankedChoiceUserConstraint.all).resolve
      assert_equal [constraint], resolved.to_a
    end

    it "returns everything to site admins" do
      constraint
      resolved =
        RankedChoiceUserConstraintPolicy::Scope.new(
          create(:user, site_admin: true),
          RankedChoiceUserConstraint.all
        ).resolve
      assert_equal [constraint], resolved.to_a
    end

    it "restricts identity assumers to the assumed convention" do
      constraint
      user = create_user_with_update_signups_in_convention(convention)

      same =
        RankedChoiceUserConstraintPolicy::Scope.new(
          create_identity_assumer(user, convention),
          RankedChoiceUserConstraint.all
        ).resolve
      other =
        RankedChoiceUserConstraintPolicy::Scope.new(
          create_identity_assumer_from_other_convention(user),
          RankedChoiceUserConstraint.all
        ).resolve

      assert_equal [constraint], same.to_a
      assert_equal [], other.to_a
    end
  end
end
