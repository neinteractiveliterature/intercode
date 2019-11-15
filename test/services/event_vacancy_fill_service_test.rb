require 'test_helper'

class EventVacancyFillServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

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

  let(:the_run) { create :run, event: event }
  let(:convention) { event.convention }
  let(:bucket_key) { 'dogs' }

  def create_signup(**attrs)
    user_con_profile = create(:user_con_profile, convention: convention)
    create(
      :signup,
      user_con_profile: user_con_profile,
      run: the_run,
      **attrs
    )
  end

  let(:anything_signup) do
    create_signup(state: 'confirmed', bucket_key: 'anything', requested_bucket_key: bucket_key)
  end

  let(:waitlist_signup) do
    create_signup(state: 'waitlisted', requested_bucket_key: bucket_key)
  end

  let(:waitlist_no_pref_signup) do
    create_signup(state: 'waitlisted', requested_bucket_key: nil)
  end

  let(:no_pref_signup) do
    create_signup(state: 'confirmed', bucket_key: bucket_key, requested_bucket_key: nil)
  end

  subject { EventVacancyFillService.new(the_run, bucket_key) }

  it 'moves an anything-bucket signup into the vacancy' do
    anything_signup

    result = subject.call
    assert result.success?

    assert_equal 1, result.move_results.size
    move_result = result.move_results.first
    assert_equal anything_signup.id, move_result.signup_id
    assert_equal 'confirmed', move_result.prev_state
    assert_equal 'anything', move_result.prev_bucket_key

    assert_equal bucket_key, anything_signup.reload.bucket_key
  end

  it 'moves a waitlist signup into the vacancy' do
    waitlist_signup

    result = subject.call
    assert result.success?

    assert_equal 1, result.move_results.size
    move_result = result.move_results.first
    assert_equal waitlist_signup.id, move_result.signup_id
    assert_equal 'waitlisted', move_result.prev_state
    assert_nil move_result.prev_bucket_key

    assert_equal bucket_key, waitlist_signup.reload.bucket_key
  end

  it 'moves a no-preference signup out of the way in order to fill a vacancy' do
    travel(-2.seconds) do
      no_pref_signup
    end
    travel(-1.second) do
      anything_signup
    end
    waitlist_signup

    result = EventVacancyFillService.new(the_run, 'cats').call
    assert result.success?

    assert_equal 2, result.move_results.size
    no_pref_move_result = result.move_results.first
    assert_equal no_pref_signup.id, no_pref_move_result.signup_id
    assert_equal 'confirmed', no_pref_move_result.prev_state
    assert_equal bucket_key, no_pref_move_result.prev_bucket_key

    waitlist_move_result = result.move_results.second
    assert_equal waitlist_signup.id, waitlist_move_result.signup_id
    assert_equal 'waitlisted', waitlist_move_result.prev_state
    assert_nil waitlist_move_result.prev_bucket_key

    assert_equal 'dogs', waitlist_signup.reload.bucket_key
    assert_equal 'cats', no_pref_signup.reload.bucket_key

    # shouldn't have moved the signup that's already in flex
    assert_equal 'anything', anything_signup.reload.bucket_key
  end

  it 'handles waitlisted signups in strictly chronological order, regardless of no-pref status' do
    travel(-2.seconds) do
      anything_signup
    end
    travel(-1.second) do
      waitlist_no_pref_signup
    end
    waitlist_signup

    result = EventVacancyFillService.new(the_run, 'anything').call
    assert result.success?

    assert_equal 1, result.move_results.size
    waitlist_no_pref_move_result = result.move_results.first
    assert_equal waitlist_no_pref_signup.id, waitlist_no_pref_move_result.signup_id
    assert_equal 'waitlisted', waitlist_no_pref_move_result.prev_state
    assert_nil waitlist_no_pref_move_result.prev_bucket_key
    assert_equal 'confirmed', waitlist_no_pref_move_result.state
    assert_equal 'anything', waitlist_no_pref_move_result.bucket_key

    assert_equal 'anything', waitlist_no_pref_signup.reload.bucket_key
  end

  it 'does not move confirmed signups if not necessary' do
    travel(-1.second) do
      anything_signup
    end
    waitlist_signup

    result = subject.call
    assert result.success?

    assert_equal 1, result.move_results.size

    waitlist_move_result = result.move_results.first
    assert_equal waitlist_signup.id, waitlist_move_result.signup_id
    assert_equal 'waitlisted', waitlist_move_result.prev_state
    assert waitlist_move_result.prev_bucket_key.nil?

    assert_equal 'anything', anything_signup.reload.bucket_key
    assert_equal bucket_key, waitlist_signup.reload.bucket_key
  end

  it 'notifies moved users who were waitlisted' do
    waitlist_signup

    perform_enqueued_jobs do
      result = subject.call
      assert result.success?

      assert_equal 1, ActionMailer::Base.deliveries.size
      recipients = ActionMailer::Base.deliveries.map(&:to)
      assert_equal [[waitlist_signup.user_con_profile.email]], recipients
    end
  end

  it 'does not notify moved users who were already confirmed' do
    anything_signup

    perform_enqueued_jobs do
      result = subject.call
      assert result.success?

      assert_equal 0, ActionMailer::Base.deliveries.size
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
    assert result.failure?
    assert_match(
      /\ARegistrations for #{Regexp.escape convention.name} are frozen/,
      result.errors.full_messages.join('\n')
    )
  end

  describe 'with not-counted buckets' do
    let(:event) do
      create(
        :event,
        registration_policy: {
          buckets: [
            { key: 'pc', slots_limited: true, total_slots: 1 },
            { key: 'npc', slots_limited: true, total_slots: 1, not_counted: true },
            { key: 'spectator', slots_limited: false },
            { key: 'anything', slots_limited: true, total_slots: 1, anything: true }
          ]
        }
      )
    end

    describe 'drops in the not-counted bucket' do
      let(:bucket_key) { 'npc' }

      it 'fills drops with people who requested it' do
        waitlist_signup
        result = subject.call
        assert result.success?

        assert_equal 1, result.move_results.size
        move_result = result.move_results.first
        assert_equal waitlist_signup.id, move_result.signup_id
        assert_equal 'waitlisted', move_result.prev_state
        assert_nil move_result.prev_bucket_key

        assert_equal bucket_key, waitlist_signup.reload.bucket_key
      end

      it 'will not fill in drops with no-preference signups' do
        create_signup(state: 'waitlisted', requested_bucket_key: nil)

        result = subject.call
        assert result.success?

        assert_equal 0, result.move_results.size
      end
    end

    describe 'drops in other buckets' do
      let(:bucket_key) { 'pc' }

      it 'will not fill them in using not-counted signups' do
        create_signup(
          state: 'confirmed', bucket_key: 'npc', requested_bucket_key: 'npc', counted: false
        )

        result = subject.call
        assert result.success?

        assert_equal 0, result.move_results.size
      end

      it 'will not fill them in using unlimited signups' do
        create_signup(state: 'confirmed', bucket_key: 'spectator', requested_bucket_key: 'spectator')

        result = subject.call
        assert result.success?

        assert_equal 0, result.move_results.size
      end
    end

    describe 'drops in unlimited buckets' do
      let(:bucket_key) { 'spectator' }

      it 'will not fill them' do
        waitlist_signup
        result = subject.call
        assert result.success?

        assert_equal 0, result.move_results.size
      end
    end
  end
end
