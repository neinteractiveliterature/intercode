require "test_helper"

class EventSignupServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  let(:convention) { create(:convention, :with_notification_templates, ticket_mode: "required_for_signup") }
  let(:event) { create(:event, convention:) }
  let(:the_run) { create(:run, event:) }
  let(:user_con_profile) { create(:user_con_profile, convention:) }
  let(:user) { user_con_profile.user }
  let(:ticket_type) { create(:free_ticket_type, convention:) }
  let(:ticket) { create(:ticket, ticket_type:, user_con_profile:) }
  let(:requested_bucket_key) { :unlimited }

  subject { EventSignupService.new(user_con_profile, the_run, bucket_id_for(the_run, requested_bucket_key), user) }

  describe "without a valid ticket" do
    it "disallows signups" do
      result = subject.call
      assert result.failure?
      assert_match(
        /\AYou must have a valid ticket to #{Regexp.escape convention.name}/,
        result.errors.full_messages.join('\n')
      )
    end
  end

  describe "with a ticket that does not allow signups" do
    let(:ticket_type) { create(:free_ticket_type, convention:, allows_event_signups: false) }

    setup { ticket }

    it "disallows signups" do
      result = subject.call
      assert result.failure?
      assert_match(/\AYou have a #{Regexp.escape ticket_type.description}/, result.errors.full_messages.join('\n'))
    end
  end

  describe "with a convention that does not require tickets" do
    let(:convention) { create(:convention, :with_notification_templates, ticket_mode: "disabled") }

    before { convention.signup_rounds.first.update!(maximum_event_signups: "unlimited") }

    it "signs the user up for an event" do
      result = subject.call!
      assert result.success?
      assert result.signup.confirmed?
    end
  end

  describe "with a convention that uses ticket_per_event mode" do
    let(:convention) { create(:convention, :with_notification_templates, ticket_mode: "ticket_per_event") }

    before { convention.signup_rounds.first.update!(maximum_event_signups: "unlimited") }

    it "signs the user up for an event with a ticket purchase hold" do
      result = subject.call!
      assert result.success?
      assert result.signup.ticket_purchase_hold?
      assert result.signup.expires_at
      assert result.signup.expires_at < 1.hour.from_now
    end
  end

  describe "with a valid ticket" do
    setup { ticket }

    before { convention.signup_rounds.first.update!(maximum_event_signups: "unlimited") }

    it "signs the user up for an event and emails them a confirmation" do
      perform_enqueued_jobs do
        result = subject.call!
        assert result.success?
        assert result.signup.confirmed?

        assert_equal 1, ActionMailer::Base.deliveries.size
        recipients = ActionMailer::Base.deliveries.flat_map(&:to)
        assert_equal recipients, [user.email]
      end
    end

    it "emails the team members who have requested it" do
      email_team_member = create(:team_member, event:, receive_signup_email: "all_signups")
      email_team_member2 = create(:team_member, event:, receive_signup_email: "non_waitlist_signups")
      no_email_team_member = create(:team_member, event:, receive_signup_email: "no")

      perform_enqueued_jobs do
        # suppress confirmations so that we can check for only 1 email
        result =
          EventSignupService.new(
            user_con_profile,
            the_run,
            bucket_id_for(the_run, requested_bucket_key),
            user,
            suppress_confirmation: true
          ).call!
        assert result.success?

        assert_equal 1, ActionMailer::Base.deliveries.size
        recipients = ActionMailer::Base.deliveries.flat_map(&:to)
        assert_includes recipients, email_team_member.user_con_profile.email
        assert_includes recipients, email_team_member2.user_con_profile.email
        assert_not_includes recipients, no_email_team_member.user_con_profile.email
      end
    end

    it "disallows signups when the user is already signed up" do
      existing_bucket_id = bucket_id_for(the_run, requested_bucket_key)
      create(
        :signup,
        run: the_run,
        user_con_profile:,
        requested_bucket_id: existing_bucket_id,
        bucket_id: existing_bucket_id,
        state: "confirmed",
        counted: true
      )

      result = subject.call
      assert result.failure?
      assert_match(/already signed up/, result.errors.full_messages.join('\n'))
    end

    describe "as a team member" do
      let(:requested_bucket_key) { nil }

      setup { create(:team_member, event:, user_con_profile:) }

      it "signs up a team member as not counted" do
        result = subject.call!

        assert result.success?
        assert result.signup.confirmed?
        assert_not result.signup.counted?
        assert_nil result.signup.bucket_key
        assert_nil result.signup.requested_bucket_key
      end

      it "does not care whether signups are open yet" do
        result = subject.call!
        assert result.success?
        assert result.signup.confirmed?
      end
    end

    it "allows signups if the user has not yet reached the current signup limit" do
      convention.signup_rounds.update!(maximum_event_signups: "1")

      result = subject.call!
      assert result.success?
      assert result.signup.confirmed?
    end

    it "does not count non-counted signups towards the signup limit" do
      convention.signup_rounds.update!(maximum_event_signups: "1")

      another_event = create(:event, convention:)
      another_run = create(:run, event: another_event, starts_at: the_run.ends_at)
      create(:signup, counted: false, user_con_profile:, run: another_run)

      result = subject.call!
      assert result.success?
      assert result.signup.confirmed?
    end

    it "does count waitlisted signups towards the signup limit" do
      convention.signup_rounds.update!(maximum_event_signups: "1")

      another_event = create(:event, convention:)
      another_run = create(:run, event: another_event, starts_at: the_run.ends_at)
      create(:signup, state: "waitlisted", user_con_profile:, run: another_run)

      result = subject.call
      assert result.failure?
      assert_match(/\AYou are already signed up for 1 event/, result.errors.full_messages.join('\n'))
    end

    it "does count ticket_purchase_hold signups towards the signup limit" do
      convention.signup_rounds.update!(maximum_event_signups: "1")

      another_event = create(:event, convention:)
      another_run = create(:run, event: another_event, starts_at: the_run.ends_at)
      create(:signup, state: "ticket_purchase_hold", user_con_profile:, run: another_run)

      result = subject.call
      assert result.failure?
      assert_match(/\AYou are already signed up for 1 event/, result.errors.full_messages.join('\n'))
    end

    it "does not count withdrawn signups towards the signup limit" do
      convention.signup_rounds.update!(maximum_event_signups: "1")

      another_event = create(:event, convention:)
      another_run = create(:run, event: another_event, starts_at: the_run.ends_at)
      create(:signup, state: "withdrawn", user_con_profile:, run: another_run)

      result = subject.call!
      assert result.success?
      assert result.signup.confirmed?
    end

    it "disallows signups if the user has reached the current signup limit" do
      convention.signup_rounds.update!(maximum_event_signups: "1")

      other_event = create(:event, convention:, length_seconds: event.length_seconds)
      other_run = create(:run, event: other_event, starts_at: the_run.starts_at + (event.length_seconds * 2))
      other_signup_service =
        EventSignupService.new(user_con_profile, other_run, bucket_id_for(other_run, requested_bucket_key), user)
      assert other_signup_service.call.success?

      result = subject.call
      assert result.failure?
      assert_match(/\AYou are already signed up for 1 event/, result.errors.full_messages.join('\n'))
    end

    it "disallows signups if signups are not yet open" do
      convention.signup_rounds.first.update!(maximum_event_signups: "not_yet")

      result = subject.call
      assert result.failure?
      assert_match(/\ASignups are not allowed at this time/, result.errors.full_messages.join('\n'))
    end

    it "disallows signups to a frozen convention" do
      create(:signup_round, convention:, maximum_event_signups: "not_now", start: 1.day.ago)

      result = subject.call
      assert result.failure?
      assert_match(
        /\ARegistrations for #{Regexp.escape convention.name} are frozen/,
        result.errors.full_messages.join('\n')
      )
    end

    describe "with a conflicting event" do
      let(:other_event) { create(:event, convention:, length_seconds: event.length_seconds) }
      let(:other_run) { create(:run, event: other_event, starts_at: the_run.starts_at) }

      it "disallows signups with conflicting waitlist games" do
        waitlist_signup1 =
          create(
            :signup,
            user_con_profile:,
            run: other_run,
            state: "waitlisted",
            bucket_id: nil,
            requested_bucket_id: bucket_id_for(other_run, "unlimited")
          )

        assert waitlist_signup1.waitlisted?

        result = subject.call
        assert result.failure?
        assert waitlist_signup1.reload.waitlisted?
        assert_match(
          /\AYou are already waitlisted for #{Regexp.escape other_event.title}/,
          result.errors.full_messages.join('\n')
        )
      end

      it "disallows signups to conflicting events" do
        other_signup_service =
          EventSignupService.new(user_con_profile, other_run, bucket_id_for(other_run, requested_bucket_key), user)
        assert other_signup_service.call.success?

        result = subject.call
        assert result.failure?
        assert_match(
          /\AYou are already signed up for #{Regexp.escape other_event.title}/,
          result.errors.full_messages.join('\n')
        )
      end

      it "allows signups to conflicting events that allow concurrent signups" do
        other_event.update!(can_play_concurrently: true)
        other_signup_service =
          EventSignupService.new(user_con_profile, other_run, bucket_id_for(other_run, requested_bucket_key), user)
        assert other_signup_service.call.success?

        result = subject.call!
        assert result.success?
      end

      it "allows signups to conflicting events if this one allows concurrent signups" do
        other_signup_service =
          EventSignupService.new(user_con_profile, other_run, bucket_id_for(other_run, requested_bucket_key), user)
        assert other_signup_service.call.success?

        event.update!(can_play_concurrently: true)

        result = subject.call!
        assert result.success?
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
    end

    describe "with limited buckets" do
      let(:event) do
        create(
          :event,
          convention:,
          registration_policy:
            RegistrationPolicy.build_from_hash(
              buckets: [
                { key: "dogs", name: "dogs", slots_limited: true, total_slots: 3 },
                { key: "cats", name: "cats", slots_limited: true, total_slots: 2 },
                { key: "anything", name: "flex", slots_limited: true, total_slots: 4, anything: true }
              ]
            )
        )
      end

      let(:requested_bucket_key) { :cats }

      before { convention.signup_rounds.first.update!(maximum_event_signups: "unlimited") }

      it "will sign the user up into that bucket" do
        result = subject.call!
        assert result.success?
        assert result.signup.confirmed?
        assert_equal "cats", result.signup.bucket_key
        assert_equal "cats", result.signup.requested_bucket_key
      end

      it "will fall back to the anything bucket if necessary" do
        2.times { create_other_signup "cats" }

        result = subject.call!
        assert result.success?
        assert result.signup.confirmed?
        assert_equal "anything", result.signup.bucket_key
        assert_equal "cats", result.signup.requested_bucket_key
      end

      it "will go to the waitlist if necessary" do
        2.times { create_other_signup "cats" }
        4.times { create_other_signup "anything" }

        result = subject.call
        assert result.success?
        assert result.signup.waitlisted?
        assert result.signup.bucket_key.nil?
        assert_equal "cats", result.signup.requested_bucket_key
      end

      it "will go to the waitlist even if the other signups are ticket_purchase_hold" do
        2.times { create_other_signup "cats", state: "ticket_purchase_hold" }
        4.times { create_other_signup "anything", state: "ticket_purchase_hold" }

        result = subject.call
        assert result.success?
        assert result.signup.waitlisted?
        assert result.signup.bucket_key.nil?
        assert_equal "cats", result.signup.requested_bucket_key
      end

      it "emails only the team members who have requested waitlist emails" do
        email_team_member = create(:team_member, event:, receive_signup_email: "all_signups")
        no_email_team_member = create(:team_member, event:, receive_signup_email: "non_waitlist_signups")
        2.times { create_other_signup "cats" }
        4.times { create_other_signup "anything" }

        perform_enqueued_jobs do
          # suppress confirmations so that we can check for only 1 email
          result =
            EventSignupService.new(
              user_con_profile,
              the_run,
              bucket_id_for(the_run, requested_bucket_key),
              user,
              suppress_confirmation: true
            ).call!
          assert result.success?

          assert_equal 1, ActionMailer::Base.deliveries.size
          recipients = ActionMailer::Base.deliveries.first.to
          assert_includes recipients, email_team_member.user_con_profile.email
          assert_not_includes recipients, no_email_team_member.user_con_profile.email
        end
      end

      describe "signing up to a nonexistent bucket" do
        let(:requested_bucket_key) { "nonexistent" }

        it "disallows signups to a nonexistent bucket" do
          result = subject.call
          assert result.failure?
          assert_match(
            /\APlease choose one of the following buckets: dogs, cats.\z/,
            result.errors.full_messages.join('\n')
          )
        end
      end

      describe "signing up to the anything bucket" do
        let(:requested_bucket_key) { "anything" }

        it "disallows signups to the anything bucket" do
          result = subject.call
          assert result.failure?
          assert_match(
            /\APlease choose one of the following buckets: dogs, cats.\z/,
            result.errors.full_messages.join('\n')
          )
        end
      end

      describe "signing up without a requested bucket" do
        let(:requested_bucket_key) { nil }

        it "prioritizes the anything bucket" do
          result = subject.call
          assert result.success?
          assert result.signup.confirmed?
          assert_nil result.signup.requested_bucket_key
          assert_equal "anything", result.signup.bucket_key
        end

        it "puts you into some other bucket if anything is full" do
          4.times { create_other_signup "anything" }

          result = subject.call
          assert result.success?
          assert result.signup.confirmed?
          assert_nil result.signup.requested_bucket_key
          assert_not_equal "anything", result.signup.bucket_key
        end

        describe "but the registration policy does not allow it" do
          let(:event) do
            create(
              :event,
              convention:,
              registration_policy:
                RegistrationPolicy.build_from_hash(
                  buckets: [
                    { key: "dogs", name: "dogs", slots_limited: true, total_slots: 3 },
                    { key: "cats", name: "cats", slots_limited: true, total_slots: 2 },
                    { key: "anything", name: "flex", slots_limited: true, total_slots: 4, anything: true }
                  ],
                  prevent_no_preference_signups: true
                )
            )
          end

          it "prevents it" do
            result = subject.call
            assert result.failure?
            assert_match(
              /\APlease choose one of the following buckets: dogs, cats.\z/,
              result.errors.full_messages.join('\n')
            )
          end
        end
      end

      describe "when there are signups without a requested bucket" do
        it "does not move them if you could go into flex" do
          # we'll assume there used to be 4 in the flex bucket, but one dropped
          3.times { create_other_signup "anything" }
          _immovable_signup = create_other_signup "cats"
          movable_signup = create_other_signup "cats", requested_bucket_key: nil

          result = subject.call!
          assert result.success?
          assert result.signup.confirmed?
          assert_equal "cats", result.signup.requested_bucket_key
          assert_equal "anything", result.signup.bucket_key

          movable_signup.reload
          assert_equal "cats", movable_signup.bucket_key
          assert_nil movable_signup.requested_bucket_key
        end

        it "moves them into a different bucket if the flex bucket is not possible" do
          4.times { create_other_signup "anything" }
          _immovable_signup = create_other_signup "cats"
          movable_signup = create_other_signup "cats", requested_bucket_key: nil

          result = subject.call!
          assert result.success?
          assert result.signup.confirmed?
          assert_equal "cats", result.signup.requested_bucket_key
          assert_equal "cats", result.signup.bucket_key

          movable_signup.reload
          assert_equal "dogs", movable_signup.bucket_key
          assert_nil movable_signup.requested_bucket_key
        end

        it "waitlists you if not possible" do
          4.times { create_other_signup "anything" }
          3.times { create_other_signup "dogs" }
          _immovable_signup = create_other_signup "cats"
          movable_signup = create_other_signup "cats", requested_bucket_key: nil

          result = subject.call!
          assert result.success?
          assert result.signup.waitlisted?
          assert_equal "cats", result.signup.requested_bucket_key
          assert_nil result.signup.bucket_key

          movable_signup.reload
          assert_equal "cats", movable_signup.bucket_key
          assert_nil movable_signup.requested_bucket_key
        end
      end

      describe "not-counted signups in a counted bucket" do
        it "lets other people sign up" do
          3.times { create_other_signup "cats", counted: false }
          4.times { create_other_signup "anything" }

          result = subject.call!

          assert result.success?
          assert result.signup.confirmed?
          assert_equal "cats", result.signup.bucket_key
        end

        it "lets people waitlist" do
          2.times { create_other_signup "cats", counted: false }
          2.times { create_other_signup "cats" }
          4.times { create_other_signup "anything" }

          result = subject.call!

          assert result.success?
          assert result.signup.waitlisted?
          assert_equal "cats", result.signup.requested_bucket_key
          assert_nil result.signup.bucket_key
        end
      end
    end

    describe "with not-counted buckets" do
      let(:event) do
        create(
          :event,
          convention:,
          registration_policy:
            RegistrationPolicy.build_from_hash(
              buckets: [
                { key: "pc", name: "PC", slots_limited: true, total_slots: 1 },
                { key: "npc", name: "NPC", slots_limited: true, total_slots: 1, not_counted: true },
                { key: "anything", name: "Flex", slots_limited: true, total_slots: 4, anything: true }
              ]
            )
        )
      end

      let(:requested_bucket_key) { :npc }

      before { convention.signup_rounds.first.update!(maximum_event_signups: "unlimited") }

      it "will sign the user up into that bucket" do
        result = subject.call!
        assert result.success?
        assert result.signup.confirmed?
        assert_not result.signup.counted?
        assert_equal "npc", result.signup.bucket_key
        assert_equal "npc", result.signup.requested_bucket_key
      end

      it "will not use anything buckets" do
        create_other_signup("npc")
        result = subject.call!
        assert result.success?
        assert result.signup.waitlisted?
        assert_nil result.signup.bucket_key
        assert_equal "npc", result.signup.requested_bucket_key
      end

      it "will still sign the user up if the run is otherwise full" do
        create_other_signup("pc")
        4.times { create_other_signup("anything") }
        result = subject.call!
        assert result.success?
        assert result.signup.confirmed?
        assert_not result.signup.counted?
        assert_equal "npc", result.signup.bucket_key
        assert_equal "npc", result.signup.requested_bucket_key
      end

      describe "no-preference signups" do
        let(:requested_bucket_key) { nil }
        it "will not put no-preference signups into the not-counted bucket" do
          create_other_signup("pc")
          4.times { create_other_signup("anything") }
          result = subject.call!
          assert result.success?
          assert result.signup.waitlisted?
          assert_nil result.signup.bucket_key
          assert_nil result.signup.requested_bucket_key
        end
      end
    end
  end

  describe "with a valid ticket and many existing signups on the run" do
    setup { ticket }

    before do
      convention.signup_rounds.first.update!(maximum_event_signups: "unlimited")
      10.times { create_other_signup(:unlimited) }
    end

    it "does not issue a bucket query per existing signup" do
      queries = count_queries(/registration_policy_buckets/) { subject.call! }
      assert_operator queries, :<=, 6, "expected a constant number of bucket queries regardless of signup count"
    end

    it "does not issue a user_con_profile query per existing signup" do
      queries = count_queries(/SELECT "user_con_profiles"/) { subject.call! }
      assert_operator queries,
                      :<=,
                      2,
                      "expected a constant number of user_con_profile queries regardless of signup count"
    end
  end

  describe "in a moderated-signup convention" do
    let(:convention) { create(:convention, :with_notification_templates, signup_mode: "moderated") }

    it "does not allow self-service signups" do
      result = subject.call
      assert result.failure?
      assert_match(/does not allow self-service signups/, result.errors.full_messages.join('\n'))
    end
  end

  describe "in ranked-choice conventions" do
    let(:convention) { create(:convention, :with_notification_templates, signup_automation_mode: "ranked_choice") }

    it "allows signups normally" do
      create(
        :signup_round,
        convention:,
        maximum_event_signups: "unlimited",
        start: 1.minute.ago,
        executed_at: 1.minute.ago
      )

      result = subject.call!

      assert result.success?
      assert result.signup.confirmed?
    end

    it "does not allow signups while waiting for a signup round to process" do
      create(:signup_round, convention:, maximum_event_signups: "unlimited", start: 1.minute.ago, executed_at: nil)

      result = subject.call

      assert result.failure?
      assert_match(/\AWe are currently processing ranked choice signups/, result.errors.full_messages.join('\n'))
    end

    it "allows ranked-choice signup acceptance during a round" do
      create(:signup_round, convention:, maximum_event_signups: "unlimited", start: 1.minute.ago, executed_at: nil)
      signup_ranked_choice = create(:signup_ranked_choice, user_con_profile:, target_run: the_run)

      result = AcceptSignupRankedChoiceService.new(signup_ranked_choice:, whodunit: nil).call!

      assert result.success?
      assert result.signup.confirmed?
    end

    it "automatically deletes any ranked choices the user has for this run/bucket" do
      create(
        :signup_round,
        convention:,
        maximum_event_signups: "unlimited",
        start: 1.minute.ago,
        executed_at: 1.minute.ago
      )
      signup_ranked_choice = create(:signup_ranked_choice, user_con_profile:, target_run: the_run)

      result = subject.call!

      assert result.success?
      assert_equal 0, SignupRankedChoice.where(id: signup_ranked_choice.id).count
    end
  end

  private

  # Resolves a bucket key (symbol/string) to the real bucket_id on the given run's registration
  # policy. Returns nil for a nil key (no-preference), and a nonexistent id (-1) for a key that
  # doesn't match any bucket, so callers can still exercise "invalid bucket requested" behavior.
  def bucket_id_for(run, key)
    return nil if key.nil?
    run.registration_policy.bucket_with_key(key)&.id || -1
  end

  def create_other_signup(bucket_key, **attributes)
    signup_user_con_profile = create(:user_con_profile, convention:)
    requested_bucket_key =
      attributes.key?(:requested_bucket_key) ? attributes.delete(:requested_bucket_key) : bucket_key
    create(
      :signup,
      {
        user_con_profile: signup_user_con_profile,
        run: the_run,
        bucket_id: bucket_id_for(the_run, bucket_key),
        requested_bucket_id: bucket_id_for(the_run, requested_bucket_key)
      }.merge(attributes)
    )
  end

  def count_queries(pattern)
    count = 0
    subscriber =
      ActiveSupport::Notifications.subscribe("sql.active_record") do |*, payload|
        count += 1 if pattern.match?(payload[:sql])
      end
    yield
    count
  ensure
    ActiveSupport::Notifications.unsubscribe(subscriber) if subscriber
  end
end
