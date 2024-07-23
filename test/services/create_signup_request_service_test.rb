require "test_helper"

class CreateSignupRequestServiceTest < ActiveSupport::TestCase
  let(:convention) do
    create(:convention, :with_notification_templates, signup_mode: "moderated", signup_requests_open: true)
  end
  let(:event) { create(:event, convention:) }
  let(:the_run) { create(:run, event:) }
  let(:user_con_profile) { create(:user_con_profile, convention:) }
  let(:user) { user_con_profile.user }
  let(:ticket_type) { create(:free_ticket_type, convention:) }
  let(:ticket) { create(:ticket, ticket_type:, user_con_profile:) }
  let(:requested_bucket_key) { :unlimited }

  subject do
    CreateSignupRequestService.new(user_con_profile:, target_run: the_run, requested_bucket_key:, whodunit: user)
  end

  describe "if signup requests are closed" do
    let(:convention) do
      create(:convention, :with_notification_templates, signup_mode: "moderated", signup_requests_open: false)
    end

    it "does not allow signup requests" do
      result = subject.call
      assert result.failure?
      assert_match(/\ASignup requests are closed/, result.errors.full_messages.join('\n'))
    end
  end

  describe "in a self-service signup convention" do
    let(:convention) { create(:convention, :with_notification_templates, signup_mode: "self_service") }

    it "does not allow signup requests" do
      result = subject.call
      assert result.failure?
      assert_match(/please sign up for events directly/, result.errors.full_messages.join('\n'))
    end
  end

  describe "in a limited signup round" do
    let(:signup_round) { create(:signup_round, convention:, maximum_event_signups: "1") }
    let(:other_event) { create(:event, convention:, length_seconds: event.length_seconds) }
    let(:other_run) { create(:run, event: other_event, starts_at: the_run.ends_at) }

    before do
      signup_round
      other_run
    end

    it "lets you request signups up to the limit" do
      result = subject.call
      assert result.success?
    end

    it "does not let you add additional signup requests if you already have too many pending" do
      create(:signup_request, user_con_profile:, target_run: other_run, state: "pending")
      result = subject.call
      assert result.failure?
      assert_match(/\AYou have already requested to sign up for 1 event/, result.errors.full_messages.join('\n'))
    end

    it "does not let you add additional signup requests if you already are at the signup limit" do
      create(:signup, user_con_profile:, run: other_run, state: "confirmed")
      result = subject.call
      assert result.failure?
      assert_match(/\AYou are already signed up for 1 event/, result.errors.full_messages.join('\n'))
    end

    describe "the target run is non-counted" do
      let(:event) do
        create(
          :event,
          convention:,
          registration_policy:
            RegistrationPolicy.new(
              buckets: [RegistrationPolicy::Bucket.new(key: "unlimited", slots_limited: false, not_counted: true)]
            )
        )
      end

      it "lets you request a signup even if there's a signup request pending" do
        create(:signup_request, user_con_profile:, target_run: other_run, state: "pending")
        result = subject.call
        assert result.success?
      end

      it "lets you request a signup even if you're already signed up for the other run" do
        create(:signup, user_con_profile:, run: other_run, state: "confirmed")
        result = subject.call
        assert result.success?
      end
    end

    describe "the other run is non-counted" do
      let(:other_event) do
        create(
          :event,
          convention:,
          length_seconds: event.length_seconds,
          registration_policy:
            RegistrationPolicy.new(
              buckets: [RegistrationPolicy::Bucket.new(key: "unlimited", slots_limited: false, not_counted: true)]
            )
        )
      end

      it "lets you request a signup even if there's a signup request pending" do
        create(:signup_request, user_con_profile:, target_run: other_run, state: "pending")
        result = subject.call
        assert result.success?
      end

      it "lets you request a signup even if you're already signed up for the other run" do
        create(:signup, user_con_profile:, run: other_run, state: "confirmed")
        result = subject.call
        assert result.success?
      end
    end
  end

  describe "conflicts" do
    let(:other_event) { create(:event, convention:, length_seconds: event.length_seconds) }
    let(:other_run) { create(:run, event: other_event, starts_at: the_run.starts_at) }

    it "counts a conflicting signup as a conflict" do
      create(:signup, user_con_profile:, run: other_run, state: "confirmed")

      result = subject.call
      assert result.failure?
      assert_match(
        /\AYou are already signed up for #{Regexp.escape other_event.title}/,
        result.errors.full_messages.join('\n')
      )
    end

    it "counts a pending request as a conflict" do
      create(:signup_request, user_con_profile:, target_run: other_run, state: "pending")

      result = subject.call
      assert result.failure?
      assert_match(
        /\AYou are already requesting to sign up for #{Regexp.escape other_event.title}/,
        result.errors.full_messages.join('\n')
      )
    end

    it "does not count a rejected request as a conflict" do
      create(:signup_request, user_con_profile:, target_run: other_run, state: "withdrawn")

      result = subject.call
      assert result.success?
    end
  end

  describe "in ranked-choice conventions" do
    let(:convention) do
      create(
        :convention,
        :with_notification_templates,
        signup_automation_mode: "ranked_choice",
        signup_mode: "moderated",
        signup_requests_open: true
      )
    end

    it "allows signup requests normally" do
      create(
        :signup_round,
        convention:,
        maximum_event_signups: "unlimited",
        start: 1.minute.ago,
        executed_at: 1.minute.ago
      )

      result = subject.call!

      assert result.success?
    end

    it "does not allow signup requests while waiting for a signup round to process" do
      create(:signup_round, convention:, maximum_event_signups: "unlimited", start: 1.minute.ago, executed_at: nil)

      result = subject.call

      assert result.failure?
      assert_match(/\AWe are currently processing ranked choice signups/, result.errors.full_messages.join('\n'))
    end
  end
end
