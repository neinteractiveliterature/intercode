require 'test_helper'

class EventWithdrawServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  let(:event) { FactoryGirl.create :event }
  let(:the_run) { FactoryGirl.create :run, event: event }
  let(:convention) { event.convention }
  let(:user_con_profile) { FactoryGirl.create :user_con_profile, convention: convention }
  let(:user) { user_con_profile.user }
  let(:bucket_key) { 'unlimited' }
  let(:signup_state) { 'confirmed' }
  let(:signup) do
    FactoryGirl.create(
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

  it 'notifies team members'

  describe 'with limited buckets' do
    let(:event) do
      FactoryGirl.create(
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

    let(:anything_user_con_profile) { FactoryGirl.create(:user_con_profile, convention: convention) }
    let(:anything_signup) do
      FactoryGirl.create(
        :signup,
        user_con_profile: anything_user_con_profile,
        run: the_run,
        state: 'confirmed',
        bucket_key: 'anything',
        requested_bucket_key: bucket_key
      )
    end

    let(:waitlist_user_con_profile) { FactoryGirl.create(:user_con_profile, convention: convention) }
    let(:waitlist_signup) do
      FactoryGirl.create(
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
      move_result = result.move_results.first
      move_result.signup.must_equal anything_signup
      move_result.prev_state.must_equal 'confirmed'
      move_result.prev_bucket_key.must_equal 'anything'

      anything_signup.reload.bucket_key.must_equal bucket_key
    end

    it 'moves a waitlist signup into the vacancy' do
      waitlist_signup

      result = subject.call
      result.must_be :success?
      signup.reload.must_be :withdrawn?

      result.move_results.size.must_equal 1
      move_result = result.move_results.first
      move_result.signup.must_equal waitlist_signup
      move_result.prev_state.must_equal 'waitlisted'
      move_result.prev_bucket_key.must_be :nil?

      waitlist_signup.reload.bucket_key.must_equal bucket_key
    end

    it 'cascades vacancy filling chronologically' do
      anything_signup
      waitlist_signup

      result = subject.call
      result.must_be :success?
      signup.reload.must_be :withdrawn?

      result.move_results.size.must_equal 2

      anything_move_result = result.move_results.first
      anything_move_result.signup.must_equal anything_signup
      anything_move_result.prev_state.must_equal 'confirmed'
      anything_move_result.prev_bucket_key.must_equal 'anything'

      waitlist_move_result = result.move_results.second
      waitlist_move_result.signup.must_equal waitlist_signup
      waitlist_move_result.prev_state.must_equal 'waitlisted'
      waitlist_move_result.prev_bucket_key.must_be :nil?

      anything_signup.reload.bucket_key.must_equal bucket_key
      waitlist_signup.reload.bucket_key.must_equal 'anything'
    end

    it 'notifies moved users'
  end

end