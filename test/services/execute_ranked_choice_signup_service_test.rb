require "test_helper"

describe ExecuteRankedChoiceSignupService do
  let(:convention) { create(:convention, :with_notification_templates) }

  it "signs a user up in the happy path" do
    event = create(:event, convention:)
    the_run = create(:run, event:)
    signup_ranked_choice = create(:signup_ranked_choice, target_run: the_run)

    result = ExecuteRankedChoiceSignupService.new(signup_ranked_choice:, whodunit: nil).call!

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

    result = ExecuteRankedChoiceSignupService.new(signup_ranked_choice:, whodunit: nil).call!

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

    result = ExecuteRankedChoiceSignupService.new(signup_ranked_choice:, whodunit: nil, allow_waitlist: true).call!

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

    result = ExecuteRankedChoiceSignupService.new(signup_ranked_choice:, whodunit: nil).call!

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

      result = ExecuteRankedChoiceSignupService.new(signup_ranked_choice:, whodunit: nil).call!

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

      result = ExecuteRankedChoiceSignupService.new(signup_ranked_choice:, whodunit: nil, allow_waitlist: true).call!

      signup_ranked_choice.reload
      assert_equal "waitlist", result.decision.decision
      assert_nil result.decision.signup
      assert_equal "pending", result.decision.signup_request.state
      assert_equal "requested", signup_ranked_choice.state
    end
  end
end
