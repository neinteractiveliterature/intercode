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
end
