require 'test_helper'

class EventSignupServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  let(:convention) do
    create :convention, :with_notification_templates, ticket_mode: 'required_for_signup'
  end
  let(:event) { create :event, convention: convention }
  let(:the_run) { create :run, event: event }
  let(:user_con_profile) { create :user_con_profile, convention: convention }
  let(:user) { user_con_profile.user }
  let(:ticket_type) { create :free_ticket_type, convention: convention }
  let(:ticket) { create :ticket, ticket_type: ticket_type, user_con_profile: user_con_profile }
  let(:requested_bucket_key) { :unlimited }

  subject { EventSignupService.new(user_con_profile, the_run, requested_bucket_key, user) }

  describe 'without a valid ticket' do
    it 'disallows signups' do
      result = subject.call
      assert result.failure?
      assert_match(
        /\AYou must have a valid ticket to #{Regexp.escape convention.name}/,
        result.errors.full_messages.join('\n')
      )
    end
  end

  describe 'with a ticket that does not allow signups' do
    let(:ticket_type) do
      create :free_ticket_type, convention: convention, allows_event_signups: false
    end

    setup do
      ticket
    end

    it 'disallows signups' do
      result = subject.call
      assert result.failure?
      assert_match(
        /\AYou have a #{Regexp.escape ticket_type.description}/,
        result.errors.full_messages.join('\n')
      )
    end
  end

  describe 'with a convention that does not require tickets' do
    let(:convention) { create :convention, :with_notification_templates, ticket_mode: 'disabled' }

    it 'signs the user up for an event' do
      result = subject.call
      assert result.success?
      assert result.signup.confirmed?
    end
  end

  describe 'with a valid ticket' do
    setup do
      ticket
    end

    it 'signs the user up for an event' do
      result = subject.call
      assert result.success?
      assert result.signup.confirmed?
    end

    it 'emails the team members who have requested it' do
      email_team_member = create(:team_member, event: event, receive_signup_email: 'all_signups')
      email_team_member2 = create(:team_member, event: event, receive_signup_email: 'non_waitlist_signups')
      no_email_team_member = create(:team_member, event: event, receive_signup_email: 'no')

      perform_enqueued_jobs do
        result = subject.call
        assert result.success?

        assert_equal 1, ActionMailer::Base.deliveries.size
        recipients = ActionMailer::Base.deliveries.flat_map(&:to)
        assert_includes recipients, email_team_member.user_con_profile.email
        assert_includes recipients, email_team_member2.user_con_profile.email
        refute_includes recipients, no_email_team_member.user_con_profile.email
      end
    end

    it 'disallows signups when the user is already signed up' do
      create(
        :signup,
        run: the_run,
        user_con_profile: user_con_profile,
        requested_bucket_key: requested_bucket_key,
        bucket_key: requested_bucket_key,
        state: 'confirmed',
        counted: true
      )

      result = subject.call
      assert result.failure?
      assert_match(
         /already signed up/,
         result.errors.full_messages.join('\n')
      )
    end

    describe 'as a team member' do
      let(:requested_bucket_key) { nil }

      setup do
        create(:team_member, event: event, user_con_profile: user_con_profile)
      end

      it 'signs up a team member as not counted' do
        result = subject.call

        assert result.success?
        assert result.signup.confirmed?
        refute result.signup.counted?
        assert_nil result.signup.bucket_key
        assert_nil result.signup.requested_bucket_key
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
        assert result.success?
        assert result.signup.confirmed?
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
      assert result.success?
      assert result.signup.confirmed?
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
      another_event = create(:event, convention: convention)
      another_run = create(:run, event: another_event, starts_at: the_run.ends_at)
      create(
        :signup,
        counted: false,
        user_con_profile: user_con_profile,
        run: another_run
      )

      result = subject.call
      assert result.success?
      assert result.signup.confirmed?
    end

    it 'does count waitlisted signups towards the signup limit' do
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

      another_event = create(:event, convention: convention)
      another_run = create(:run, event: another_event, starts_at: the_run.ends_at)
      create(
        :signup,
        state: 'waitlisted',
        user_con_profile: user_con_profile,
        run: another_run
      )

      result = subject.call
      assert result.failure?
      assert_match /\AYou are already signed up for 1 event/, result.errors.full_messages.join('\n')
    end

    it 'does not count withdrawn signups towards the signup limit' do
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
      another_event = create(:event, convention: convention)
      another_run = create(:run, event: another_event, starts_at: the_run.ends_at)
      create(
        :signup,
        state: 'withdrawn',
        user_con_profile: user_con_profile,
        run: another_run
      )

      result = subject.call
      assert result.success?
      assert result.signup.confirmed?
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

      other_event = create(:event, convention: convention, length_seconds: event.length_seconds)
      other_run = create(:run, event: other_event, starts_at: the_run.starts_at + event.length_seconds * 2)
      other_signup_service = EventSignupService.new(user_con_profile, other_run, requested_bucket_key, user)
      assert other_signup_service.call.success?

      result = subject.call
      assert result.failure?
      assert_match /\AYou are already signed up for 1 event/, result.errors.full_messages.join('\n')
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
      assert result.failure?
      assert_match /\ASignups are not allowed at this time/, result.errors.full_messages.join('\n')
    end

    it 'disallows signups to a frozen convention' do
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
      assert_match /\ARegistrations for #{Regexp.escape convention.name} are frozen/, result.errors.full_messages.join('\n')
    end

    describe 'with a conflicting event' do
      let(:other_event) { create(:event, convention: convention, length_seconds: event.length_seconds) }
      let(:other_run) { create(:run, event: other_event, starts_at: the_run.starts_at) }

      it 'disallows signups with conflicting waitlist games' do
        waitlist_signup1 = create(
          :signup,
          user_con_profile: user_con_profile,
          run: other_run,
          state: 'waitlisted',
          bucket_key: nil,
          requested_bucket_key: 'unlimited'
        )

        assert waitlist_signup1.waitlisted?

        result = subject.call
        assert result.failure?
        assert waitlist_signup1.reload.waitlisted?
        assert_match /\AYou are already waitlisted for #{Regexp.escape other_event.title}/, result.errors.full_messages.join('\n')
      end

      it 'disallows signups to conflicting events' do
        other_signup_service = EventSignupService.new(user_con_profile, other_run, requested_bucket_key, user)
        assert other_signup_service.call.success?

        result = subject.call
        assert result.failure?
        assert_match /\AYou are already signed up for #{Regexp.escape other_event.title}/, result.errors.full_messages.join('\n')
      end

      it 'allows signups to conflicting events that allow concurrent signups' do
        other_event.update!(can_play_concurrently: true)
        other_signup_service = EventSignupService.new(user_con_profile, other_run, requested_bucket_key, user)
        assert other_signup_service.call.success?

        result = subject.call
        assert result.success?
      end

      it 'allows signups to conflicting events if this one allows concurrent signups' do
        other_signup_service = EventSignupService.new(user_con_profile, other_run, requested_bucket_key, user)
        assert other_signup_service.call.success?

        event.update!(can_play_concurrently: true)

        result = subject.call
        assert result.success?
      end
    end

    describe 'with limited buckets' do
      let(:event) do
        create(
          :event,
          convention: convention,
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
        assert result.success?
        assert result.signup.confirmed?
        assert_equal 'cats', result.signup.bucket_key
        assert_equal 'cats', result.signup.requested_bucket_key
      end

      it 'will fall back to the anything bucket if necessary' do
        2.times { create_other_signup 'cats' }

        result = subject.call
        assert result.success?
        assert result.signup.confirmed?
        assert_equal 'anything', result.signup.bucket_key
        assert_equal 'cats', result.signup.requested_bucket_key
      end

      it 'will go to the waitlist if necessary' do
        2.times { create_other_signup 'cats' }
        4.times { create_other_signup 'anything' }

        result = subject.call
        assert result.success?
        assert result.signup.waitlisted?
        assert result.signup.bucket_key.nil?
        assert_equal 'cats', result.signup.requested_bucket_key
      end

      it 'emails only the team members who have requested waitlist emails' do
        email_team_member = create(:team_member, event: event, receive_signup_email: 'all_signups')
        no_email_team_member = create(:team_member, event: event, receive_signup_email: 'non_waitlist_signups')
        2.times { create_other_signup 'cats' }
        4.times { create_other_signup 'anything' }

        perform_enqueued_jobs do
          result = subject.call
          assert result.success?

          assert_equal 1, ActionMailer::Base.deliveries.size
          recipients = ActionMailer::Base.deliveries.map(&:to)
          assert_includes recipients, [email_team_member.user_con_profile.email]
          refute_includes recipients, [no_email_team_member.user_con_profile.email]
        end
      end

      describe 'signing up to a nonexistent bucket' do
        let(:requested_bucket_key) { 'nonexistent' }

        it 'disallows signups to a nonexistent bucket' do
          result = subject.call
          assert result.failure?
          assert_match /\APlease choose one of the following buckets: dogs, cats.\z/, result.errors.full_messages.join('\n')
        end
      end

      describe 'signing up to the anything bucket' do
        let(:requested_bucket_key) { 'anything' }

        it 'disallows signups to the anything bucket' do
          result = subject.call
          assert result.failure?
          assert_match /\APlease choose one of the following buckets: dogs, cats.\z/, result.errors.full_messages.join('\n')
        end
      end

      describe 'signing up without a requested bucket' do
        let(:requested_bucket_key) { nil }

        it 'prioritizes the anything bucket' do
          result = subject.call
          assert result.success?
          assert result.signup.confirmed?
          assert_nil result.signup.requested_bucket_key
          assert_equal 'anything', result.signup.bucket_key
        end

        it 'puts you into some other bucket if anything is full' do
          4.times { create_other_signup 'anything' }

          result = subject.call
          assert result.success?
          assert result.signup.confirmed?
          assert_nil result.signup.requested_bucket_key
          refute_equal 'anything', result.signup.bucket_key
        end

        describe 'but the registration policy does not allow it' do
          let(:event) do
            create(
              :event,
              convention: convention,
              registration_policy: {
                buckets: [
                  { key: 'dogs', name: 'dogs', slots_limited: true, total_slots: 3 },
                  { key: 'cats', name: 'cats', slots_limited: true, total_slots: 2 },
                  { key: 'anything', name: 'flex', slots_limited: true, total_slots: 4, anything: true }
                ],
                prevent_no_preference_signups: true
              }
            )
          end

          it 'prevents it' do
            result = subject.call
            assert result.failure?
            assert_match /\APlease choose one of the following buckets: dogs, cats.\z/, result.errors.full_messages.join('\n')
          end
        end
      end

      describe 'when there are signups without a requested bucket' do
        it 'does not move them if you could go into flex' do
          # we'll assume there used to be 4 in the flex bucket, but one dropped
          3.times { create_other_signup 'anything' }
          immovable_signup = create_other_signup 'cats'
          movable_signup = create_other_signup 'cats', requested_bucket_key: nil

          result = subject.call
          assert result.success?
          assert result.signup.confirmed?
          assert_equal 'cats', result.signup.requested_bucket_key
          assert_equal 'anything', result.signup.bucket_key

          movable_signup.reload
          assert_equal 'cats', movable_signup.bucket_key
          assert_nil movable_signup.requested_bucket_key
        end

        it 'moves them into a different bucket if the flex bucket is not possible' do
          4.times { create_other_signup 'anything' }
          immovable_signup = create_other_signup 'cats'
          movable_signup = create_other_signup 'cats', requested_bucket_key: nil

          result = subject.call
          assert result.success?
          assert result.signup.confirmed?
          assert_equal 'cats', result.signup.requested_bucket_key
          assert_equal 'cats', result.signup.bucket_key

          movable_signup.reload
          assert_equal 'dogs', movable_signup.bucket_key
          assert_nil movable_signup.requested_bucket_key
        end

        it 'waitlists you if not possible' do
          4.times { create_other_signup 'anything' }
          3.times { create_other_signup 'dogs' }
          immovable_signup = create_other_signup 'cats'
          movable_signup = create_other_signup 'cats', requested_bucket_key: nil

          result = subject.call
          assert result.success?
          assert result.signup.waitlisted?
          assert_equal 'cats', result.signup.requested_bucket_key
          assert_nil result.signup.bucket_key

          movable_signup.reload
          assert_equal 'cats', movable_signup.bucket_key
          assert_nil movable_signup.requested_bucket_key
        end
      end
    end

    describe 'with not-counted buckets' do
      let(:event) do
        create(
          :event,
          convention: convention,
          registration_policy: {
            buckets: [
              { key: 'pc', name: 'PC', slots_limited: true, total_slots: 1 },
              { key: 'npc', name: 'NPC', slots_limited: true, total_slots: 1, not_counted: true },
              { key: 'anything', name: 'Flex', slots_limited: true, total_slots: 4, anything: true }
            ]
          }
        )
      end

      let(:requested_bucket_key) { :npc }

      it 'will sign the user up into that bucket' do
        result = subject.call
        assert result.success?
        assert result.signup.confirmed?
        refute result.signup.counted?
        assert_equal 'npc', result.signup.bucket_key
        assert_equal 'npc', result.signup.requested_bucket_key
      end

      it 'will not use anything buckets' do
        create_other_signup('npc')
        result = subject.call
        assert result.success?
        assert result.signup.waitlisted?
        assert_nil result.signup.bucket_key
        assert_equal 'npc', result.signup.requested_bucket_key
      end

      describe 'no-preference signups' do
        let(:requested_bucket_key) { nil }
        it 'will not put no-preference signups into the not-counted bucket' do
          create_other_signup('pc')
          4.times { create_other_signup('anything') }
          result = subject.call
          assert result.success?
          assert result.signup.waitlisted?
          assert_nil result.signup.bucket_key
          assert_nil result.signup.requested_bucket_key
        end
      end
    end
  end

  private

  def create_other_signup(bucket_key, **attributes)
    signup_user_con_profile = create(:user_con_profile, convention: convention)
    create(
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
