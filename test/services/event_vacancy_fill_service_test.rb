require "test_helper"

class EventVacancyFillServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  let(:convention) { create(:convention, :with_notification_templates) }
  let(:event) do
    create(
      :event,
      convention:,
      registration_policy: {
        buckets: [
          { key: "dogs", slots_limited: true, total_slots: 1 },
          { key: "cats", slots_limited: true, total_slots: 1 },
          { key: "anything", slots_limited: true, total_slots: 1, anything: true }
        ]
      }
    )
  end

  let(:the_run) { create(:run, event:) }
  let(:bucket_key) { "dogs" }

  def create_signup(**attrs)
    user_con_profile = create(:user_con_profile, convention:)
    create(:signup, user_con_profile:, run: the_run, **attrs)
  end

  let(:anything_signup) { create_signup(state: "confirmed", bucket_key: "anything", requested_bucket_key: bucket_key) }

  let(:waitlist_signup) { create_signup(state: "waitlisted", requested_bucket_key: bucket_key) }

  let(:waitlist_no_pref_signup) { create_signup(state: "waitlisted", requested_bucket_key: nil) }

  let(:no_pref_signup) { create_signup(state: "confirmed", bucket_key:, requested_bucket_key: nil) }

  subject { EventVacancyFillService.new(the_run, bucket_key) }

  it "moves an anything-bucket signup into the vacancy" do
    anything_signup

    result = subject.call
    assert result.success?

    assert_equal 1, result.move_results.size
    move_result = result.move_results.first
    assert_equal anything_signup.id, move_result.signup_id
    assert_equal "confirmed", move_result.prev_state
    assert_equal "anything", move_result.prev_bucket_key

    assert_equal bucket_key, anything_signup.reload.bucket_key
  end

  it "moves a waitlist signup into the vacancy" do
    waitlist_signup

    result = subject.call
    assert result.success?

    assert_equal 1, result.move_results.size
    move_result = result.move_results.first
    assert_equal waitlist_signup.id, move_result.signup_id
    assert_equal "waitlisted", move_result.prev_state
    assert_nil move_result.prev_bucket_key

    assert_equal bucket_key, waitlist_signup.reload.bucket_key
  end

  it "moves a no-preference signup out of the way in order to fill a vacancy" do
    travel(-2.seconds) { no_pref_signup }
    travel(-1.second) { anything_signup }
    waitlist_signup

    result = EventVacancyFillService.new(the_run, "cats").call
    assert result.success?

    assert_equal 2, result.move_results.size
    no_pref_move_result = result.move_results.first
    assert_equal no_pref_signup.id, no_pref_move_result.signup_id
    assert_equal "confirmed", no_pref_move_result.prev_state
    assert_equal bucket_key, no_pref_move_result.prev_bucket_key

    waitlist_move_result = result.move_results.second
    assert_equal waitlist_signup.id, waitlist_move_result.signup_id
    assert_equal "waitlisted", waitlist_move_result.prev_state
    assert_nil waitlist_move_result.prev_bucket_key

    assert_equal "dogs", waitlist_signup.reload.bucket_key
    assert_equal "cats", no_pref_signup.reload.bucket_key

    # shouldn't have moved the signup that's already in flex
    assert_equal "anything", anything_signup.reload.bucket_key
  end

  it "does not move no-preference signups if the registration policy does not allow it" do
    travel(-2.seconds) { no_pref_signup }
    travel(-1.second) { anything_signup }
    waitlist_signup
    event.allow_registration_policy_change = true
    frozen_policy = event.registration_policy.dup.tap { |p| p.assign_attributes(freeze_no_preference_buckets: true) }
    event.update!(registration_policy: frozen_policy)

    cats_result = EventVacancyFillService.new(the_run, "cats").call
    assert cats_result.success?

    assert_equal 0, cats_result.move_results.size
  end

  it "still pulls no-preference signups from the waitlist even if the registration policy has frozen no-pref" do
    travel(-2.seconds) { create_signup(state: "confirmed", bucket_key: "cats", requested_bucket_key: nil) }
    travel(-1.second) { create_signup(state: "confirmed", bucket_key: "anything", requested_bucket_key: nil) }
    waitlist_no_pref_signup
    event.allow_registration_policy_change = true
    frozen_policy = event.registration_policy.dup.tap { |p| p.assign_attributes(freeze_no_preference_buckets: true) }
    event.update!(registration_policy: frozen_policy)

    dogs_result = EventVacancyFillService.new(the_run, "dogs").call
    assert dogs_result.success?

    assert_equal 1, dogs_result.move_results.size
    waitlist_move_result = dogs_result.move_results.first
    assert_equal waitlist_no_pref_signup.id, waitlist_move_result.signup_id
    assert_equal "waitlisted", waitlist_move_result.prev_state
    assert_nil waitlist_move_result.prev_bucket_key

    assert_equal "dogs", waitlist_no_pref_signup.reload.bucket_key
  end

  it "handles waitlisted signups in strictly chronological order, regardless of no-pref status" do
    travel(-2.seconds) { anything_signup }
    travel(-1.second) { waitlist_no_pref_signup }
    waitlist_signup

    result = EventVacancyFillService.new(the_run, "anything").call
    assert result.success?

    assert_equal 1, result.move_results.size
    waitlist_no_pref_move_result = result.move_results.first
    assert_equal waitlist_no_pref_signup.id, waitlist_no_pref_move_result.signup_id
    assert_equal "waitlisted", waitlist_no_pref_move_result.prev_state
    assert_nil waitlist_no_pref_move_result.prev_bucket_key
    assert_equal "confirmed", waitlist_no_pref_move_result.state
    assert_equal "anything", waitlist_no_pref_move_result.bucket_key

    assert_equal "anything", waitlist_no_pref_signup.reload.bucket_key
  end

  it "breaks ties correctly in sub-second differences" do
    travel(-2.seconds) { anything_signup }
    waitlist_no_pref_signup
    waitlist_signup

    # Ensure that both created_at timestamps round to the same second
    waitlist_signup.update!(created_at: Time.at(waitlist_no_pref_signup.created_at.to_i))
    waitlist_no_pref_signup.update!(created_at: Time.at(waitlist_no_pref_signup.created_at.to_i) + 0.1.seconds)

    service = EventVacancyFillService.new(the_run, "anything")
    # manipulate the order the records get seen in, to confuse the sorting algorithm
    service.send(:all_signups)
    service.instance_variable_set(
      :@all_signups,
      service
        .instance_variable_get(:@all_signups)
        .sort_by do |signup|
          if signup == waitlist_no_pref_signup
            -1
          else
            1
          end
        end
    )

    result = service.call
    assert result.success?

    assert_equal 1, result.move_results.size
    move_result = result.move_results.first
    assert_equal waitlist_signup.id, move_result.signup_id
    assert_equal "waitlisted", move_result.prev_state
    assert_nil move_result.prev_bucket_key
    assert_equal "confirmed", move_result.state
    assert_equal "anything", move_result.bucket_key

    assert_equal "anything", waitlist_signup.reload.bucket_key
  end

  it "does not move confirmed signups if not necessary" do
    travel(-1.second) { anything_signup }
    waitlist_signup

    result = subject.call
    assert result.success?

    assert_equal 1, result.move_results.size

    waitlist_move_result = result.move_results.first
    assert_equal waitlist_signup.id, waitlist_move_result.signup_id
    assert_equal "waitlisted", waitlist_move_result.prev_state
    assert waitlist_move_result.prev_bucket_key.nil?

    assert_equal "anything", anything_signup.reload.bucket_key
    assert_equal bucket_key, waitlist_signup.reload.bucket_key
  end

  it "notifies moved users who were waitlisted" do
    waitlist_signup

    perform_enqueued_jobs do
      result = subject.call
      assert result.success?

      assert_equal 1, ActionMailer::Base.deliveries.size
      recipients = ActionMailer::Base.deliveries.map(&:to)
      assert_equal [[waitlist_signup.user_con_profile.email]], recipients
    end
  end

  it "does not notify moved users who were already confirmed" do
    anything_signup

    perform_enqueued_jobs do
      result = subject.call
      assert result.success?

      assert_equal 0, ActionMailer::Base.deliveries.size
    end
  end

  it "disallows vacancy filling in a frozen convention" do
    create(:signup_round, convention:, maximum_event_signups: "not_now", start: 1.day.ago, executed_at: 1.day.ago)

    result = subject.call
    assert result.failure?
    assert_match(
      /\ARegistrations for #{Regexp.escape convention.name} are frozen/,
      result.errors.full_messages.join('\n')
    )
  end

  describe "with not-counted buckets" do
    let(:event) do
      create(
        :event,
        convention:,
        registration_policy: {
          buckets: [
            { key: "pc", slots_limited: true, total_slots: 1 },
            { key: "npc", slots_limited: true, total_slots: 1, not_counted: true },
            { key: "spectator", slots_limited: false },
            { key: "anything", slots_limited: true, total_slots: 1, anything: true }
          ]
        }
      )
    end

    describe "drops in the not-counted bucket" do
      let(:bucket_key) { "npc" }

      it "fills drops with people who requested it" do
        waitlist_signup
        result = subject.call
        assert result.success?

        assert_equal 1, result.move_results.size
        move_result = result.move_results.first
        assert_equal waitlist_signup.id, move_result.signup_id
        assert_equal "waitlisted", move_result.prev_state
        assert_nil move_result.prev_bucket_key

        assert_equal bucket_key, waitlist_signup.reload.bucket_key
      end

      it "will not fill in drops with no-preference signups" do
        create_signup(state: "waitlisted", requested_bucket_key: nil)

        result = subject.call
        assert result.success?

        assert_equal 0, result.move_results.size
      end
    end

    describe "drops in other buckets" do
      let(:bucket_key) { "pc" }

      it "will not fill them in using not-counted signups" do
        create_signup(state: "confirmed", bucket_key: "npc", requested_bucket_key: "npc", counted: false)

        result = subject.call
        assert result.success?

        assert_equal 0, result.move_results.size
      end

      it "will not fill them in using unlimited signups" do
        create_signup(state: "confirmed", bucket_key: "spectator", requested_bucket_key: "spectator")

        result = subject.call
        assert result.success?

        assert_equal 0, result.move_results.size
      end
    end

    describe "drops in unlimited buckets" do
      let(:bucket_key) { "spectator" }

      it "will not fill them" do
        waitlist_signup
        result = subject.call
        assert result.success?

        assert_equal 0, result.move_results.size
      end
    end
  end
end
