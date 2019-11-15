require 'test_helper'

class EventWithdrawServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  let(:event) { create :event }
  let(:the_run) { create :run, event: event }
  let(:convention) { event.convention }
  let(:user_con_profile) { create :user_con_profile, convention: convention }
  let(:user) { user_con_profile.user }
  let(:bucket_key) { 'unlimited' }
  let(:signup_state) { 'confirmed' }
  let(:signup) do
    create(
      :signup,
      user_con_profile: user_con_profile,
      run: the_run,
      state: signup_state,
      bucket_key: bucket_key,
      requested_bucket_key: bucket_key
    )
  end

  subject { EventWithdrawService.new(signup, user) }

  it 'withdraws the user from an event' do
    result = subject.call
    assert result.success?
    assert signup.reload.withdrawn?
    assert result.move_results.empty?
  end

  it 'notifies team members who have requested it' do
    email_team_member = create(:team_member, event: event, receive_signup_email: 'all_signups')
    email_team_member2 = create(:team_member, event: event, receive_signup_email: 'non_waitlist_signups')
    no_email_team_member = create(:team_member, event: event, receive_signup_email: 'no')

    perform_enqueued_jobs do
      result = subject.call
      assert result.success?

      assert_equal 2, ActionMailer::Base.deliveries.size
      recipients = ActionMailer::Base.deliveries.map(&:to)
      assert_includes recipients, [email_team_member.user_con_profile.email]
      assert_includes recipients, [email_team_member2.user_con_profile.email]
      refute_includes recipients, [no_email_team_member.user_con_profile.email]
    end
  end

  it 'disallows withdrawals in a frozen convention' do
    convention.update!(
      maximum_event_signups: ScheduledValue::ScheduledValue.new(
        timespans: [
          {
            start: nil,
            finish: nil,
            value: 'not_now'
          }
        ]
      )
    )

    result = subject.call
    assert result.failure?
    assert_match(
      /\ARegistrations for #{Regexp.escape convention.name} are frozen/,
      result.errors.full_messages.join('\n')
    )
  end

  describe 'with limited buckets' do
    let(:event) do
      create(
        :event,
        registration_policy: {
          buckets: [
            { key: 'dogs', slots_limited: true, total_slots: 1 },
            { key: 'cats', slots_limited: true, total_slots: 1 },
            { key: 'anything', slots_limited: true, total_slots: 1, anything: true }
          ]
        }
      )
    end

    let(:bucket_key) { 'dogs' }

    let(:anything_user_con_profile) { create(:user_con_profile, convention: convention) }
    let(:anything_signup) do
      create(
        :signup,
        user_con_profile: anything_user_con_profile,
        run: the_run,
        state: 'confirmed',
        bucket_key: 'anything',
        requested_bucket_key: bucket_key
      )
    end

    let(:waitlist_user_con_profile) { create(:user_con_profile, convention: convention) }
    let(:waitlist_signup) do
      create(
        :signup,
        user_con_profile: anything_user_con_profile,
        run: the_run,
        state: 'waitlisted',
        requested_bucket_key: bucket_key
      )
    end

    it 'moves an anything-bucket signup into the vacancy' do
      anything_signup

      result = subject.call
      assert result.success?
      assert signup.reload.withdrawn?

      assert_equal 1, result.move_results.size

      assert_equal bucket_key, anything_signup.reload.bucket_key
    end

    it 'moves a waitlist signup into the vacancy' do
      waitlist_signup

      result = subject.call
      assert result.success?
      assert signup.reload.withdrawn?

      assert_equal 1, result.move_results.size

      assert_equal bucket_key, waitlist_signup.reload.bucket_key
    end

    it 'does not move confirmed signups unless necessary' do
      anything_signup
      waitlist_signup

      result = subject.call
      assert result.success?
      assert signup.reload.withdrawn?

      assert_equal 1, result.move_results.size

      assert_equal 'anything', anything_signup.reload.bucket_key
      assert_equal bucket_key, waitlist_signup.reload.bucket_key
    end

    it 'notifies team members who have requested it' do
      team_member = create(:team_member, event: event, receive_signup_email: 'all_signups')
      anything_signup

      perform_enqueued_jobs do
        result = subject.call
        assert result.success?

        recipients = ActionMailer::Base.deliveries.map(&:to)
        assert_includes recipients, [team_member.user_con_profile.email]
      end
    end
  end
end
