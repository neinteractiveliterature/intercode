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
    move_result.prev_bucket_key.must_be :nil?

    waitlist_signup.reload.bucket_key.must_equal bucket_key
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

  it 'notifies moved users' do
    anything_signup

    perform_enqueued_jobs do
      result = subject.call
      result.must_be :success?

      ActionMailer::Base.deliveries.size.must_equal 1
      recipients = ActionMailer::Base.deliveries.map(&:to)
      recipients.must_equal [[anything_signup.user_con_profile.email]]
    end
  end

  it 'disallows vacancy filling in a frozen convention' do
    convention.update!(registrations_frozen: true)

    result = subject.call
    result.must_be :failure?
    result.errors.full_messages.join('\n').must_match /\ARegistrations for #{Regexp.escape convention.name} are frozen/
  end
end
