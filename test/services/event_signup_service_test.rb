require 'test_helper'

class EventSignupServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  let(:event) { FactoryBot.create :event }
  let(:the_run) { FactoryBot.create :run, event: event }
  let(:convention) { event.convention }
  let(:user_con_profile) { FactoryBot.create :user_con_profile, convention: convention }
  let(:user) { user_con_profile.user }
  let(:ticket_type) { FactoryBot.create :free_ticket_type, convention: convention }
  let(:ticket) { FactoryBot.create :ticket, ticket_type: ticket_type, user_con_profile: user_con_profile }
  let(:requested_bucket_key) { :unlimited }

  subject { EventSignupService.new(user_con_profile, the_run, requested_bucket_key, user) }

  describe 'without a valid ticket' do
    it 'disallows signups' do
      result = subject.call
      result.must_be :failure?
      result.errors.full_messages.join('\n').must_match /\AYou must have a valid ticket to #{Regexp.escape convention.name}/
    end
  end

  describe 'with a valid ticket' do
    setup do
      ticket
    end

    it 'signs the user up for an event' do
      result = subject.call
      result.must_be :success?
      result.signup.must_be :confirmed?
    end

    it 'emails the team members who have requested it' do
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

    describe 'as a team member' do
      let(:requested_bucket_key) { nil }

      setup do
        FactoryBot.create(:team_member, event: event, user_con_profile: user_con_profile)
      end

      it 'signs up a team member as not counted' do
        result = subject.call

        result.must_be :success?
        result.signup.must_be :confirmed?
        result.signup.wont_be :counted?
        result.signup.bucket_key.must_be_nil
        result.signup.requested_bucket_key.must_be_nil
      end

      it 'does not care whether signups are open yet' do
        convention.update!(
          maximum_event_signups: ScheduledValue::ScheduledValue.new(
            timespans: [
              {
                start: nil,
                finish: nil,
                value: 'not_yet'
              }
            ]
          )
        )

        result = subject.call
        result.must_be :success?
        result.signup.must_be :confirmed?
      end
    end

    it 'allows signups if the user has not yet reached the current signup limit' do
      convention.update!(
        maximum_event_signups: ScheduledValue::ScheduledValue.new(
          timespans: [
            {
              start: nil,
              finish: nil,
              value: '1'
            }
          ]
        )
      )

      result = subject.call
      result.must_be :success?
      result.signup.must_be :confirmed?
    end

    it 'does not count non-counted signups towards the signup limit' do
      convention.update!(
        maximum_event_signups: ScheduledValue::ScheduledValue.new(
          timespans: [
            {
              start: nil,
              finish: nil,
              value: '1'
            }
          ]
        )
      )
      another_event = FactoryBot.create(:event, convention: convention)
      another_run = FactoryBot.create(:run, event: another_event)
      FactoryBot.create(
        :signup,
        counted: false,
        user_con_profile: user_con_profile,
        run: another_run
      )

      result = subject.call
      result.must_be :success?
      result.signup.must_be :confirmed?
    end

    it 'disallows signups if the user has reached the current signup limit' do
      convention.update!(
        maximum_event_signups: ScheduledValue::ScheduledValue.new(
          timespans: [
            {
              start: nil,
              finish: nil,
              value: '1'
            }
          ]
        )
      )

      other_event = FactoryBot.create(:event, length_seconds: event.length_seconds)
      other_run = FactoryBot.create(:run, event: other_event, starts_at: the_run.starts_at + event.length_seconds * 2)
      other_signup_service = EventSignupService.new(user_con_profile, other_run, requested_bucket_key, user)
      other_signup_service.call.must_be :success?

      result = subject.call
      result.must_be :failure?
      result.errors.full_messages.join('\n').must_match /\AYou are already signed up for 1 event/
    end

    it 'disallows signups if signups are not yet open' do
      convention.update!(
        maximum_event_signups: ScheduledValue::ScheduledValue.new(
          timespans: [
            {
              start: nil,
              finish: nil,
              value: 'not_yet'
            }
          ]
        )
      )

      result = subject.call
      result.must_be :failure?
      result.errors.full_messages.join('\n').must_match /\ASignups are not allowed at this time/
    end

    it 'disallows signups to a frozen convention' do
      convention.update!(registrations_frozen: true)

      result = subject.call
      result.must_be :failure?
      result.errors.full_messages.join('\n').must_match /\ARegistrations for #{Regexp.escape convention.name} are frozen/
    end

    describe 'with a conflicting event' do
      let(:other_event) { FactoryBot.create(:event, length_seconds: event.length_seconds) }
      let(:other_run) { FactoryBot.create(:run, event: other_event, starts_at: the_run.starts_at) }

      it 'correctly determines the conflicting waitlist signups' do
        waitlist_signup1 = FactoryBot.create(
          :signup,
          user_con_profile: user_con_profile,
          run: other_run,
          state: 'waitlisted',
          bucket_key: nil,
          requested_bucket_key: 'unlimited'
        )

        subject.conflicting_waitlist_signups.must_equal [waitlist_signup1]
      end

      it 'withdraws the user from conflicting waitlist games' do
        waitlist_signup1 = FactoryBot.create(
          :signup,
          user_con_profile: user_con_profile,
          run: other_run,
          state: 'waitlisted',
          bucket_key: nil,
          requested_bucket_key: 'unlimited'
        )

        waitlist_signup1.must_be :waitlisted?

        result = subject.call
        result.must_be :success?
        waitlist_signup1.reload.must_be :withdrawn?
      end

      it 'disallows signups to conflicting events' do
        other_signup_service = EventSignupService.new(user_con_profile, other_run, requested_bucket_key, user)
        other_signup_service.call.must_be :success?

        result = subject.call
        result.must_be :failure?
        result.errors.full_messages.join('\n').must_match /\AYou are already signed up for #{Regexp.escape other_event.title}/
      end

      it 'allows signups to conflicting events that allow concurrent signups' do
        other_event.update!(can_play_concurrently: true)
        other_signup_service = EventSignupService.new(user_con_profile, other_run, requested_bucket_key, user)
        other_signup_service.call.must_be :success?

        result = subject.call
        result.must_be :success?
      end

      it 'allows signups to conflicting events if this one allows concurrent signups' do
        other_signup_service = EventSignupService.new(user_con_profile, other_run, requested_bucket_key, user)
        other_signup_service.call.must_be :success?

        event.update!(can_play_concurrently: true)

        result = subject.call
        result.must_be :success?
      end
    end

    describe 'with limited buckets' do
      let(:event) do
        FactoryBot.create(
          :event,
          registration_policy: {
            buckets: [
              { key: 'dogs', name: 'dogs', slots_limited: true, total_slots: 3 },
              { key: 'cats', name: 'cats', slots_limited: true, total_slots: 2 },
              { key: 'anything', name: 'flex', slots_limited: true, total_slots: 4, anything: true }
            ]
          }
        )
      end

      let(:requested_bucket_key) { :cats }

      it 'will sign the user up into that bucket' do
        result = subject.call
        result.must_be :success?
        result.signup.must_be :confirmed?
        result.signup.bucket_key.must_equal 'cats'
        result.signup.requested_bucket_key.must_equal 'cats'
      end

      it 'will fall back to the anything bucket if necessary' do
        2.times { create_other_signup 'cats' }

        result = subject.call
        result.must_be :success?
        result.signup.must_be :confirmed?
        result.signup.bucket_key.must_equal 'anything'
        result.signup.requested_bucket_key.must_equal 'cats'
      end

      it 'will go to the waitlist if necessary' do
        2.times { create_other_signup 'cats' }
        4.times { create_other_signup 'anything' }

        result = subject.call
        result.must_be :success?
        result.signup.must_be :waitlisted?
        result.signup.bucket_key.must_be :nil?
        result.signup.requested_bucket_key.must_equal 'cats'
      end

      describe 'signing up to a nonexistent bucket' do
        let(:requested_bucket_key) { 'nonexistent' }

        it 'disallows signups to a nonexistent bucket' do
          result = subject.call
          result.must_be :failure?
          result.errors.full_messages.join('\n').must_match /\APlease choose one of the following buckets: dogs, cats.\z/
        end
      end

      describe 'signing up to the anything bucket' do
        let(:requested_bucket_key) { 'anything' }

        it 'disallows signups to the anything bucket' do
          result = subject.call
          result.must_be :failure?
          result.errors.full_messages.join('\n').must_match /\APlease choose one of the following buckets: dogs, cats.\z/
        end
      end

      describe 'signing up without a requested bucket' do
        let(:requested_bucket_key) { nil }

        it 'prioritizes the anything bucket' do
          result = subject.call
          result.must_be :success?
          result.signup.must_be :confirmed?
          result.signup.requested_bucket_key.must_be_nil
          result.signup.bucket_key.must_equal 'anything'
        end

        it 'puts you into some other bucket if anything is full' do
          4.times { create_other_signup 'anything' }

          result = subject.call
          result.must_be :success?
          result.signup.must_be :confirmed?
          result.signup.requested_bucket_key.must_be_nil
          result.signup.bucket_key.wont_equal 'anything'
        end
      end

      describe 'when there are signups without a requested bucket' do
        it 'moves them into the flex bucket if possible' do
          # we'll assume there used to be 4 in the flex bucket, but one dropped
          3.times { create_other_signup 'anything' }
          immovable_signup = create_other_signup 'cats'
          movable_signup = create_other_signup 'cats', requested_bucket_key: nil

          result = subject.call
          result.must_be :success?
          result.signup.must_be :confirmed?
          result.signup.requested_bucket_key.must_equal 'cats'
          result.signup.bucket_key.must_equal 'cats'

          movable_signup.reload
          movable_signup.bucket_key.must_equal 'anything'
          movable_signup.requested_bucket_key.must_be_nil
        end

        it 'moves them into a different bucket if the flex bucket is not possible' do
          4.times { create_other_signup 'anything' }
          immovable_signup = create_other_signup 'cats'
          movable_signup = create_other_signup 'cats', requested_bucket_key: nil

          result = subject.call
          result.must_be :success?
          result.signup.must_be :confirmed?
          result.signup.requested_bucket_key.must_equal 'cats'
          result.signup.bucket_key.must_equal 'cats'

          movable_signup.reload
          movable_signup.bucket_key.must_equal 'dogs'
          movable_signup.requested_bucket_key.must_be_nil
        end

        it 'waitlists you if not possible' do
          4.times { create_other_signup 'anything' }
          3.times { create_other_signup 'dogs' }
          immovable_signup = create_other_signup 'cats'
          movable_signup = create_other_signup 'cats', requested_bucket_key: nil

          result = subject.call
          result.must_be :success?
          result.signup.must_be :waitlisted?
          result.signup.requested_bucket_key.must_equal 'cats'
          result.signup.bucket_key.must_be_nil

          movable_signup.reload
          movable_signup.bucket_key.must_equal 'cats'
          movable_signup.requested_bucket_key.must_be_nil
        end
      end
    end
  end

  private

  def create_other_signup(bucket_key, **attributes)
    signup_user_con_profile = FactoryBot.create(:user_con_profile, convention: convention)
    FactoryBot.create(
      :signup,
      {
        user_con_profile: signup_user_con_profile,
        run: the_run,
        bucket_key: bucket_key,
        requested_bucket_key: bucket_key
      }.merge(attributes)
    )
  end
end
