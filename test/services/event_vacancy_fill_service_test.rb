require 'test_helper'

class EventVacancyFillServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

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

  let(:the_run) { FactoryBot.create :run, event: event }
  let(:convention) { event.convention }
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

  let(:no_pref_user_con_profile) { FactoryBot.create(:user_con_profile, convention: convention) }
  let(:no_pref_signup) do
    FactoryBot.create(
      :signup,
      user_con_profile: no_pref_user_con_profile,
      run: the_run,
      state: 'confirmed',
      bucket_key: bucket_key,
      requested_bucket_key: nil
    )
  end

  subject { EventVacancyFillService.new(the_run, bucket_key) }

  it 'moves an anything-bucket signup into the vacancy' do
    anything_signup

    result = subject.call
    result.must_be :success?

    result.move_results.size.must_equal 1
    move_result = result.move_results.first
    move_result.signup_id.must_equal anything_signup.id
    move_result.prev_state.must_equal 'confirmed'
    move_result.prev_bucket_key.must_equal 'anything'

    anything_signup.reload.bucket_key.must_equal bucket_key
  end

  it 'moves a waitlist signup into the vacancy' do
    waitlist_signup

    result = subject.call
    result.must_be :success?

    result.move_results.size.must_equal 1
    move_result = result.move_results.first
    move_result.signup_id.must_equal waitlist_signup.id
    move_result.prev_state.must_equal 'waitlisted'
    move_result.prev_bucket_key.must_be_nil

    waitlist_signup.reload.bucket_key.must_equal bucket_key
  end

  it 'moves a no-preference signup out of the way in order to fill a vacancy' do
    no_pref_signup
    anything_signup
    waitlist_signup

    result = EventVacancyFillService.new(the_run, 'cats').call
    result.must_be :success?

    result.move_results.size.must_equal 3
    no_pref_move_result = result.move_results.first
    no_pref_move_result.signup_id.must_equal no_pref_signup.id
    no_pref_move_result.prev_state.must_equal 'confirmed'
    no_pref_move_result.prev_bucket_key.must_equal bucket_key

    anything_move_result = result.move_results.second
    anything_move_result.signup_id.must_equal anything_signup.id
    anything_move_result.prev_state.must_equal 'confirmed'
    anything_move_result.prev_bucket_key.must_equal 'anything'

    waitlist_move_result = result.move_results.third
    waitlist_move_result.signup_id.must_equal waitlist_signup.id
    waitlist_move_result.prev_state.must_equal 'waitlisted'
    waitlist_move_result.prev_bucket_key.must_be_nil

    waitlist_signup.reload.bucket_key.must_equal 'anything'
    anything_signup.reload.bucket_key.must_equal 'dogs'
    no_pref_signup.reload.bucket_key.must_equal 'cats'
  end

  it 'cascades vacancy filling chronologically' do
    anything_signup
    waitlist_signup

    result = subject.call
    result.must_be :success?

    result.move_results.size.must_equal 2

    anything_move_result = result.move_results.first
    anything_move_result.signup_id.must_equal anything_signup.id
    anything_move_result.prev_state.must_equal 'confirmed'
    anything_move_result.prev_bucket_key.must_equal 'anything'

    waitlist_move_result = result.move_results.second
    waitlist_move_result.signup_id.must_equal waitlist_signup.id
    waitlist_move_result.prev_state.must_equal 'waitlisted'
    waitlist_move_result.prev_bucket_key.must_be :nil?

    anything_signup.reload.bucket_key.must_equal bucket_key
    waitlist_signup.reload.bucket_key.must_equal 'anything'
  end

  it 'notifies moved users who were waitlisted' do
    waitlist_signup

    perform_enqueued_jobs do
      result = subject.call
      result.must_be :success?

      ActionMailer::Base.deliveries.size.must_equal 1
      recipients = ActionMailer::Base.deliveries.map(&:to)
      recipients.must_equal [[anything_signup.user_con_profile.email]]
    end
  end

  it 'does not notify moved users who were already confirmed' do
    anything_signup

    perform_enqueued_jobs do
      result = subject.call
      result.must_be :success?

      ActionMailer::Base.deliveries.size.must_equal 0
    end
  end

  it 'disallows vacancy filling in a frozen convention' do
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
    result.must_be :failure?
    result.errors.full_messages.join('\n').must_match /\ARegistrations for #{Regexp.escape convention.name} are frozen/
  end
end
