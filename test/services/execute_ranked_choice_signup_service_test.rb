require "test_helper"

describe ExecuteRankedChoiceSignupService do
  let(:convention) { create(:convention, :with_notification_templates) }
  let(:signup_round) { create(:signup_round, convention:, start: 1.day.ago) }

  it "signs a user up in the happy path" do
    event = create(:event, convention:)
    the_run = create(:run, event:)
    signup_ranked_choice = create(:signup_ranked_choice, target_run: the_run)

    result = ExecuteRankedChoiceSignupService.new(signup_round:, signup_ranked_choice:, whodunit: nil).call!

    signup_ranked_choice.reload
    assert_equal "signup", result.decision.decision
    assert_equal "confirmed", result.decision.signup.state
    assert_equal "signed_up", signup_ranked_choice.state
  end

  it "skips the choice if there's no room in the run" do
    event =
      create(
        :event,
        convention:,
        registration_policy:
          RegistrationPolicy.new(buckets: [RegistrationPolicy::Bucket.new(slots_limited: true, total_slots: 0)])
      )
    the_run = create(:run, event:)
    signup_ranked_choice = create(:signup_ranked_choice, target_run: the_run)

    result = ExecuteRankedChoiceSignupService.new(signup_round:, signup_ranked_choice:, whodunit: nil).call!

    signup_ranked_choice.reload
    assert_equal "skip_choice", result.decision.decision
    assert_equal "full", result.decision.reason
    assert_nil result.decision.signup
    assert_equal "pending", signup_ranked_choice.state
  end

  it "waitlists if there's no room in the run and waitlisting is allowed" do
    event =
      create(
        :event,
        convention:,
        registration_policy:
          RegistrationPolicy.new(buckets: [RegistrationPolicy::Bucket.new(slots_limited: true, total_slots: 0)])
      )
    the_run = create(:run, event:)
    signup_ranked_choice = create(:signup_ranked_choice, target_run: the_run)

    result =
      ExecuteRankedChoiceSignupService.new(
        signup_round:,
        signup_ranked_choice:,
        whodunit: nil,
        allow_waitlist: true
      ).call!

    signup_ranked_choice.reload
    assert_equal "waitlist", result.decision.decision
    assert_equal "waitlisted", result.decision.signup.state
    assert_equal "waitlisted", signup_ranked_choice.state
  end

  it "skips the choice if the user is already signed up for an event at the same time" do
    event = create(:event, convention:)
    the_run = create(:run, event:)
    signup_ranked_choice = create(:signup_ranked_choice, target_run: the_run)
    the_other_run = create(:run, event:, starts_at: the_run.starts_at)
    conflicting_signup = create(:signup, user_con_profile: signup_ranked_choice.user_con_profile, run: the_other_run)

    result = ExecuteRankedChoiceSignupService.new(signup_round:, signup_ranked_choice:, whodunit: nil).call!

    signup_ranked_choice.reload
    assert_equal "skip_choice", result.decision.decision
    assert_equal "conflict", result.decision.reason
    assert_equal [conflicting_signup.id], result.decision.extra["conflicting_signup_ids"]
    assert_nil result.decision.signup
    assert_equal "pending", signup_ranked_choice.state
  end

  describe "in a moderated signup convention" do
    let(:convention) { create(:convention, :with_notification_templates, signup_mode: "moderated") }

    it "requests a signup in the happy path" do
      event = create(:event, convention:)
      the_run = create(:run, event:)
      signup_ranked_choice = create(:signup_ranked_choice, target_run: the_run)

      result = ExecuteRankedChoiceSignupService.new(signup_round:, signup_ranked_choice:, whodunit: nil).call!

      signup_ranked_choice.reload
      assert_equal "signup", result.decision.decision
      assert_nil result.decision.signup
      assert_equal "pending", result.decision.signup_request.state
      assert_equal "requested", signup_ranked_choice.state
    end

    it "requests a signup if the event is full and waitlisting is allowed" do
      event =
        create(
          :event,
          convention:,
          registration_policy:
            RegistrationPolicy.new(buckets: [RegistrationPolicy::Bucket.new(slots_limited: true, total_slots: 0)])
        )
      the_run = create(:run, event:)
      signup_ranked_choice = create(:signup_ranked_choice, target_run: the_run)

      result =
        ExecuteRankedChoiceSignupService.new(
          signup_round:,
          signup_ranked_choice:,
          whodunit: nil,
          allow_waitlist: true
        ).call!

      signup_ranked_choice.reload
      assert_equal "waitlist", result.decision.decision
      assert_nil result.decision.signup
      assert_equal "pending", result.decision.signup_request.state
      assert_equal "requested", signup_ranked_choice.state
    end

    it "skips the choice if the run is already fully requested" do
      event =
        create(
          :event,
          convention:,
          registration_policy:
            RegistrationPolicy.new(buckets: [RegistrationPolicy::Bucket.new(slots_limited: true, total_slots: 1)])
        )
      the_run = create(:run, event:)
      signup_ranked_choice = create(:signup_ranked_choice, target_run: the_run)
      create(:signup_request, target_run: the_run)

      result = ExecuteRankedChoiceSignupService.new(signup_round:, signup_ranked_choice:, whodunit: nil).call!

      signup_ranked_choice.reload
      assert_equal "skip_choice", result.decision.decision
      assert_equal "full", result.decision.reason
      assert_nil result.decision.signup
      assert_equal "pending", signup_ranked_choice.state
    end

    it "skips the choice if the run is already fully requested but the pending requests are no-preference" do
      event =
        create(
          :event,
          convention:,
          registration_policy:
            RegistrationPolicy.new(buckets: [RegistrationPolicy::Bucket.new(slots_limited: true, total_slots: 1)])
        )
      the_run = create(:run, event:)
      signup_ranked_choice = create(:signup_ranked_choice, target_run: the_run)
      signup_request = create(:signup_request, target_run: the_run)
      signup_request.update!(requested_bucket_key: nil)

      result = ExecuteRankedChoiceSignupService.new(signup_round:, signup_ranked_choice:, whodunit: nil).call!

      signup_ranked_choice.reload
      assert_equal "skip_choice", result.decision.decision
      assert_equal "full", result.decision.reason
      assert_nil result.decision.signup
      assert_equal "pending", signup_ranked_choice.state
    end
  end

  describe "with user constraints" do
    it "does the signup if it fits in the user constraints" do
      event = create(:event, convention:)
      the_run = create(:run, event:)
      signup_ranked_choice = create(:signup_ranked_choice, target_run: the_run)
      create(
        :ranked_choice_user_constraint,
        user_con_profile: signup_ranked_choice.user_con_profile,
        maximum_signups: 3
      )

      result = ExecuteRankedChoiceSignupService.new(signup_round:, signup_ranked_choice:, whodunit: nil).call!

      signup_ranked_choice.reload
      assert_equal "signup", result.decision.decision
      assert_equal "confirmed", result.decision.signup.state
      assert_equal "signed_up", signup_ranked_choice.state
    end

    it "only considers counted signups for constraints" do
      event = create(:event, convention:)
      the_run = create(:run, event:)
      other_event = create(:event, convention:)
      other_run = create(:run, event: other_event, starts_at: the_run.starts_at + 1.day)
      user_con_profile = create(:user_con_profile, convention:)
      signup_ranked_choice = create(:signup_ranked_choice, target_run: the_run, user_con_profile:)
      _not_counted_signup = create(:signup, user_con_profile:, run: other_run, counted: false)
      create(:ranked_choice_user_constraint, user_con_profile:, maximum_signups: 1)

      result = ExecuteRankedChoiceSignupService.new(signup_round:, signup_ranked_choice:, whodunit: nil).call!

      signup_ranked_choice.reload
      assert_equal "signup", result.decision.decision
      assert_equal "confirmed", result.decision.signup.state
      assert_equal "signed_up", signup_ranked_choice.state
    end

    it "does not sign a user up for an event that violates their constraints" do
      event = create(:event, convention:)
      the_run = create(:run, event:)
      other_event = create(:event, convention:)
      other_run = create(:run, event: other_event, starts_at: the_run.starts_at + 1.day)
      user_con_profile = create(:user_con_profile, convention:)
      signup_ranked_choice = create(:signup_ranked_choice, target_run: the_run, user_con_profile:)
      _other_signup = create(:signup, user_con_profile:, run: other_run)
      constraint = create(:ranked_choice_user_constraint, user_con_profile:, maximum_signups: 1)

      result = ExecuteRankedChoiceSignupService.new(signup_round:, signup_ranked_choice:, whodunit: nil).call!

      signup_ranked_choice.reload
      assert_equal "skip_choice", result.decision.decision
      assert_equal "ranked_choice_user_constraints", result.decision.reason
      assert_equal [constraint.id], result.decision.extra["ranked_choice_user_constraint_ids"]
    end

    it "does not sign a user up for an event if they have a zero-event constraint" do
      event = create(:event, convention:)
      the_run = create(:run, event:)
      user_con_profile = create(:user_con_profile, convention:)
      signup_ranked_choice = create(:signup_ranked_choice, target_run: the_run, user_con_profile:)
      constraint = create(:ranked_choice_user_constraint, user_con_profile:, maximum_signups: 0)

      result = ExecuteRankedChoiceSignupService.new(signup_round:, signup_ranked_choice:, whodunit: nil).call!

      signup_ranked_choice.reload
      assert_equal "skip_choice", result.decision.decision
      assert_equal "ranked_choice_user_constraints", result.decision.reason
      assert_equal [constraint.id], result.decision.extra["ranked_choice_user_constraint_ids"]
    end

    it "signs a user up for an event outside the timespan of their constraints" do
      event = create(:event, convention:)
      the_run = create(:run, event:)
      other_event = create(:event, convention:)
      other_run = create(:run, event: other_event, starts_at: the_run.starts_at + 1.day)
      user_con_profile = create(:user_con_profile, convention:)
      signup_ranked_choice = create(:signup_ranked_choice, target_run: the_run, user_con_profile:)
      _other_signup = create(:signup, user_con_profile:, run: other_run)
      create(:ranked_choice_user_constraint, user_con_profile:, maximum_signups: 1, start: other_run.starts_at - 1.hour)

      result = ExecuteRankedChoiceSignupService.new(signup_round:, signup_ranked_choice:, whodunit: nil).call!

      signup_ranked_choice.reload
      assert_equal "signup", result.decision.decision
      assert_equal "confirmed", result.decision.signup.state
      assert_equal "signed_up", signup_ranked_choice.state
    end
  end
end
