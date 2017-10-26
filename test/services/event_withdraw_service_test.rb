require 'test_helper'

class EventWithdrawServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  let(:event) { FactoryBot.create :event }
  let(:the_run) { FactoryBot.create :run, event: event }
  let(:convention) { event.convention }
  let(:user_con_profile) { FactoryBot.create :user_con_profile, convention: convention }
  let(:user) { user_con_profile.user }
  let(:bucket_key) { 'unlimited' }
  let(:signup_state) { 'confirmed' }
  let(:signup) do
    FactoryBot.create(
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
    result.must_be :success?
    signup.reload.must_be :withdrawn?
    result.move_results.must_be :empty?
  end

  it 'notifies team members who have requested it' do
    email_team_member = FactoryBot.create(:team_member, event: event, receive_signup_email: true)
    email_team_member2 = FactoryBot.create(:team_member, event: event, receive_signup_email: true)
    no_email_team_member = FactoryBot.create(:team_member, event: event, receive_signup_email: false)

    perform_enqueued_jobs do
      result = subject.call
      result.must_be :success?

      ActionMailer::Base.deliveries.size.must_equal 2
      recipients = ActionMailer::Base.deliveries.map(&:to)
      recipients.must_include [email_team_member.user_con_profile.email]
      recipients.must_include [email_team_member2.user_con_profile.email]
      recipients.wont_include [no_email_team_member.user_con_profile.email]
    end
  end

  it 'disallows withdrawals in a frozen convention' do
    convention.update!(registrations_frozen: true)

    result = subject.call
    result.must_be :failure?
    result.errors.full_messages.join('\n').must_match /\ARegistrations for #{Regexp.escape convention.name} are frozen/
  end

  describe 'with limited buckets' do
    let(:event) do
      FactoryBot.create(
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

    let(:anything_user_con_profile) { FactoryBot.create(:user_con_profile, convention: convention) }
    let(:anything_signup) do
      FactoryBot.create(
        :signup,
        user_con_profile: anything_user_con_profile,
        run: the_run,
        state: 'confirmed',
        bucket_key: 'anything',
        requested_bucket_key: bucket_key
      )
    end

    let(:waitlist_user_con_profile) { FactoryBot.create(:user_con_profile, convention: convention) }
    let(:waitlist_signup) do
      FactoryBot.create(
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
      result.must_be :success?
      signup.reload.must_be :withdrawn?

      result.move_results.size.must_equal 1

      anything_signup.reload.bucket_key.must_equal bucket_key
    end

    it 'moves a waitlist signup into the vacancy' do
      waitlist_signup

      result = subject.call
      result.must_be :success?
      signup.reload.must_be :withdrawn?

      result.move_results.size.must_equal 1

      waitlist_signup.reload.bucket_key.must_equal bucket_key
    end

    it 'cascades vacancy filling chronologically' do
      anything_signup
      waitlist_signup

      result = subject.call
      result.must_be :success?
      signup.reload.must_be :withdrawn?

      result.move_results.size.must_equal 2

      anything_signup.reload.bucket_key.must_equal bucket_key
      waitlist_signup.reload.bucket_key.must_equal 'anything'
    end

    it 'notifies team members who have requested it' do
      team_member = FactoryBot.create(:team_member, event: event, receive_signup_email: true)
      anything_signup

      perform_enqueued_jobs do
        result = subject.call
        result.must_be :success?

        recipients = ActionMailer::Base.deliveries.map(&:to)
        recipients.must_include [team_member.user_con_profile.email]
      end
    end
  end

end