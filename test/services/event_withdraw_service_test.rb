require "test_helper"

class EventWithdrawServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  let(:convention) { create(:convention, :with_notification_templates) }
  let(:event) { create(:event, convention:) }
  let(:the_run) { create(:run, event:, starts_at: 1.day.from_now) }
  let(:user_con_profile) { create(:user_con_profile, convention:) }
  let(:user) { user_con_profile.user }
  let(:bucket_key) { "unlimited" }
  let(:signup_state) { "confirmed" }
  let(:signup) do
    create(:signup, user_con_profile:, run: the_run, state: signup_state, bucket_key:, requested_bucket_key: bucket_key)
  end

  subject { EventWithdrawService.new(signup, user) }

  it "withdraws the user from an event and emails them a confirmation" do
    perform_enqueued_jobs do
      result = subject.call
      assert result.success?
      assert signup.reload.withdrawn?
      assert result.move_results.empty?

      assert_equal 1, ActionMailer::Base.deliveries.size
      recipients = ActionMailer::Base.deliveries.flat_map(&:to)
      assert_equal recipients, [user.email]
    end
  end

  it "notifies team members who have requested it" do
    email_team_member = create(:team_member, event:, receive_signup_email: "all_signups")
    email_team_member2 = create(:team_member, event:, receive_signup_email: "non_waitlist_signups")
    no_email_team_member = create(:team_member, event:, receive_signup_email: "no")

    perform_enqueued_jobs do
      # suppressing confirmation so we can only look at the emails to team members
      EventWithdrawService.new(signup, user, suppress_confirmation: true).call!

      assert_equal 1, ActionMailer::Base.deliveries.size
      recipients = ActionMailer::Base.deliveries.flat_map(&:to)
      assert_includes recipients, email_team_member.user_con_profile.email
      assert_includes recipients, email_team_member2.user_con_profile.email
      refute_includes recipients, no_email_team_member.user_con_profile.email
    end
  end

  it "disallows withdrawals in a frozen convention" do
    create(:signup_round, convention:, maximum_event_signups: "not_now", start: 1.day.ago, executed_at: 1.day.ago)

    result = subject.call
    assert result.failure?
    assert_match(
      /\ARegistrations for #{Regexp.escape convention.name} are frozen/,
      result.errors.full_messages.join('\n')
    )
  end

  it "disallows withdrawals for events that have ended" do
    event.update!(length_seconds: 4.hours)
    the_run.update!(starts_at: 5.days.ago)

    result = subject.call
    assert result.failure?
    assert_match(/\A#{Regexp.escape event.title} has ended/, result.errors.full_messages.join('\n'))
  end

  describe "with limited buckets" do
    let(:event) do
      create(
        :event,
        convention:,
        registration_policy: {
          buckets: [
            { key: "dogs", name: "dogs", slots_limited: true, total_slots: 1 },
            { key: "cats", name: "cats", slots_limited: true, total_slots: 1 },
            { key: "anything", name: "anything", slots_limited: true, total_slots: 1, anything: true }
          ]
        }
      )
    end

    let(:bucket_key) { "dogs" }

    let(:anything_user_con_profile) { create(:user_con_profile, convention:) }
    let(:anything_signup) do
      create(
        :signup,
        user_con_profile: anything_user_con_profile,
        run: the_run,
        state: "confirmed",
        bucket_key: "anything",
        requested_bucket_key: bucket_key
      )
    end

    let(:waitlist_user_con_profile) { create(:user_con_profile, convention:) }
    let(:waitlist_signup) do
      create(
        :signup,
        user_con_profile: anything_user_con_profile,
        run: the_run,
        state: "waitlisted",
        requested_bucket_key: bucket_key
      )
    end

    it "moves an anything-bucket signup into the vacancy" do
      anything_signup

      result = subject.call
      assert result.success?
      assert signup.reload.withdrawn?

      assert_equal 1, result.move_results.size

      assert_equal bucket_key, anything_signup.reload.bucket_key
    end

    it "moves a waitlist signup into the vacancy" do
      waitlist_signup

      result = subject.call
      assert result.success?
      assert signup.reload.withdrawn?

      assert_equal 1, result.move_results.size

      assert_equal bucket_key, waitlist_signup.reload.bucket_key
    end

    it "does not try to fill an overfilled bucket" do
      extra_signup = create(:signup, run: the_run, state: "confirmed", bucket_key:, requested_bucket_key: bucket_key)
      waitlist_signup

      result = subject.call
      assert result.success?
      assert signup.reload.withdrawn?

      assert_equal 0, result.move_results.size

      assert_nil waitlist_signup.reload.bucket_key
      assert_equal bucket_key, extra_signup.reload.bucket_key
    end

    it "does not move confirmed signups unless necessary" do
      anything_signup
      waitlist_signup

      result = subject.call
      assert result.success?
      assert signup.reload.withdrawn?

      assert_equal 1, result.move_results.size

      assert_equal "anything", anything_signup.reload.bucket_key
      assert_equal bucket_key, waitlist_signup.reload.bucket_key
    end

    it "notifies team members who have requested it" do
      team_member = create(:team_member, event:, receive_signup_email: "all_signups")
      anything_signup

      perform_enqueued_jobs do
        result = subject.call
        assert result.success?

        recipients = ActionMailer::Base.deliveries.map(&:to)
        assert_includes recipients, [team_member.user_con_profile.email]
      end
    end
  end

  describe "in ranked-choice conventions" do
    let(:convention) { create(:convention, :with_notification_templates, signup_automation_mode: "ranked_choice") }

    it "allows withdrawals normally" do
      create(
        :signup_round,
        convention:,
        maximum_event_signups: "unlimited",
        start: 1.minute.ago,
        executed_at: 1.minute.ago
      )

      result = subject.call!

      assert result.success?
      assert signup.reload.withdrawn?
    end

    it "does not allow withdrawals while waiting for a signup round to process" do
      create(:signup_round, convention:, maximum_event_signups: "unlimited", start: 1.minute.ago, executed_at: nil)

      result = subject.call

      assert result.failure?
      assert_match(/\AWe are currently processing ranked choice signups/, result.errors.full_messages.join('\n'))
    end
  end
end
