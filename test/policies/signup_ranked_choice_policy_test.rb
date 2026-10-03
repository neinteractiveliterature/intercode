# frozen_string_literal: true
require "test_helper"
require_relative "convention_permissions_test_helper"

class SignupRankedChoicePolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) do
    create(:convention, :with_notification_templates, signup_mode: "moderated", signup_automation_mode: "ranked_choice")
  end
  let(:event) { create(:event, convention: convention) }
  let(:target_run) { create(:run, event: event) }
  let(:signup_ranked_choice) { create(:signup_ranked_choice, target_run: target_run) }
  let(:owner) { signup_ranked_choice.user_con_profile.user }

  describe "#read?" do
    it "lets users with update_signups read ranked choices in a moderated ranked-choice convention" do
      user = create_user_with_update_signups_in_convention(convention)
      assert_policy_allows SignupRankedChoicePolicy, user, signup_ranked_choice, :read?, convention
    end

    it "does not let users with update_signups read ranked choices if the convention is not ranked-choice" do
      convention.update!(signup_automation_mode: "none")
      user = create_user_with_update_signups_in_convention(convention)
      assert_not SignupRankedChoicePolicy.new(user, signup_ranked_choice).read?
    end

    it "does not let users with update_signups read ranked choices if the convention is self-service" do
      convention.update!(signup_mode: "self_service", signup_automation_mode: "none")
      user = create_user_with_update_signups_in_convention(convention)
      assert_not SignupRankedChoicePolicy.new(user, signup_ranked_choice).read?
    end

    it "lets users read their own ranked choices" do
      assert_policy_allows SignupRankedChoicePolicy, owner, signup_ranked_choice, :read?, convention
    end

    it "does not let users read other people's ranked choices" do
      assert_not SignupRankedChoicePolicy.new(create(:user), signup_ranked_choice).read?
    end

    it "does not let anonymous users read ranked choices" do
      assert_not SignupRankedChoicePolicy.new(nil, signup_ranked_choice).read?
    end

    it "lets site admins read ranked choices" do
      assert SignupRankedChoicePolicy.new(create(:user, site_admin: true), signup_ranked_choice).read?
    end
  end

  %w[manage accept reject].each do |action|
    describe "##{action}?" do
      it "lets users with update_signups #{action} ranked choices in a moderated ranked-choice convention" do
        user = create_user_with_update_signups_in_convention(convention)
        assert_policy_allows SignupRankedChoicePolicy, user, signup_ranked_choice, "#{action}?", convention
      end

      it "does not let users with update_signups #{action} ranked choices if the convention is not ranked-choice" do
        convention.update!(signup_automation_mode: "none")
        user = create_user_with_update_signups_in_convention(convention)
        assert_not SignupRankedChoicePolicy.new(user, signup_ranked_choice).public_send("#{action}?")
      end

      it "does not let users #{action} their own ranked choices" do
        assert_not SignupRankedChoicePolicy.new(owner, signup_ranked_choice).public_send("#{action}?")
      end

      it "does not let users #{action} other people's ranked choices" do
        assert_not SignupRankedChoicePolicy.new(create(:user), signup_ranked_choice).public_send("#{action}?")
      end
    end
  end

  describe "#create?" do
    let(:user_con_profile) { create(:user_con_profile, convention: convention) }
    let(:new_choice) { SignupRankedChoice.new(target_run: target_run, user_con_profile: user_con_profile) }

    it "lets users create their own ranked choices in a ranked-choice convention" do
      assert_policy_allows SignupRankedChoicePolicy, user_con_profile.user, new_choice, :create?, convention
    end

    it "does not let users create ranked choices if the convention is not ranked-choice" do
      convention.update!(signup_automation_mode: "none")
      assert_not SignupRankedChoicePolicy.new(user_con_profile.user, new_choice).create?
    end

    it "does not let users create ranked choices for other users" do
      assert_not SignupRankedChoicePolicy.new(
                   create(:user_con_profile, convention: convention).user,
                   new_choice
                 ).create?
    end

    it "does not let users with update_signups create ranked choices for other users" do
      user = create_user_with_update_signups_in_convention(convention)
      assert_not SignupRankedChoicePolicy.new(user, new_choice).create?
    end

    it "does not let anonymous users create ranked choices" do
      assert_not SignupRankedChoicePolicy.new(nil, new_choice).create?
    end
  end

  %w[update destroy].each do |action|
    describe "##{action}?" do
      it "lets users #{action} their own pending ranked choices" do
        assert_policy_allows SignupRankedChoicePolicy, owner, signup_ranked_choice, "#{action}?", convention
      end

      it "does not let users #{action} their own non-pending ranked choices" do
        signup_ranked_choice.update!(state: "waitlisted", result_signup: create(:signup, run: target_run))
        assert_not SignupRankedChoicePolicy.new(owner, signup_ranked_choice).public_send("#{action}?")
      end

      it "does not let users #{action} other people's pending ranked choices" do
        assert_not SignupRankedChoicePolicy.new(create(:user), signup_ranked_choice).public_send("#{action}?")
      end

      it "does not let users with update_signups #{action} other people's ranked choices" do
        user = create_user_with_update_signups_in_convention(convention)
        assert_not SignupRankedChoicePolicy.new(user, signup_ranked_choice).public_send("#{action}?")
      end

      it "does not let anonymous users #{action} ranked choices" do
        assert_not SignupRankedChoicePolicy.new(nil, signup_ranked_choice).public_send("#{action}?")
      end
    end
  end

  describe "Scope" do
    it "returns all ranked choices in ranked-choice cons where you have update_signups" do
      other_convention = create(:convention, signup_mode: "moderated", signup_automation_mode: "ranked_choice")
      create(:signup_ranked_choice, target_run: create(:run, event: create(:event, convention: other_convention)))
      user = create_user_with_update_signups_in_convention(convention)

      resolved = SignupRankedChoicePolicy::Scope.new(user, SignupRankedChoice.all).resolve
      identity_assumer_resolved =
        SignupRankedChoicePolicy::Scope.new(
          create_identity_assumer_from_other_convention(user),
          SignupRankedChoice.all
        ).resolve

      assert_equal [signup_ranked_choice], resolved.to_a
      assert_equal [], identity_assumer_resolved.to_a
    end

    it "does not return ranked choices from non-ranked-choice cons where you have update_signups" do
      convention.update!(signup_automation_mode: "none")
      signup_ranked_choice
      user = create_user_with_update_signups_in_convention(convention)

      assert_equal [], SignupRankedChoicePolicy::Scope.new(user, SignupRankedChoice.all).resolve.to_a
    end

    it "returns a regular user's own ranked choices" do
      create(:signup_ranked_choice, target_run: target_run)

      resolved = SignupRankedChoicePolicy::Scope.new(owner, SignupRankedChoice.all).resolve
      identity_assumer_resolved =
        SignupRankedChoicePolicy::Scope.new(
          create_identity_assumer_from_other_convention(owner),
          SignupRankedChoice.all
        ).resolve

      assert_equal [signup_ranked_choice], resolved.to_a
      assert_equal [], identity_assumer_resolved.to_a
    end

    it "returns everything to site admins" do
      signup_ranked_choice
      resolved = SignupRankedChoicePolicy::Scope.new(create(:user, site_admin: true), SignupRankedChoice.all).resolve
      assert_equal [signup_ranked_choice], resolved.to_a
    end
  end
end
