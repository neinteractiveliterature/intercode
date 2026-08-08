require "test_helper"

class EventChangeRegistrationPolicyServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  let(:convention) { create(:convention, :with_notification_templates) }
  let(:event) { create(:event, convention: convention) }
  let(:the_run) { create(:run, event: event) }
  let(:new_registration_policy) do
    build_edited_registration_policy(
      event,
      [
        { key: "dogs", name: "Dogs", slots_limited: true, total_slots: 1 },
        { key: "cats", name: "Cats", slots_limited: true, total_slots: 1 },
        { key: "anything", name: "Anything", slots_limited: true, total_slots: 1, anything: true }
      ]
    )
  end
  let(:whodunit) { create(:user_con_profile, convention: convention) }
  let(:team_member) { create(:team_member, event: event, receive_signup_email: "all_signups") }

  subject { EventChangeRegistrationPolicyService.new(event, new_registration_policy, whodunit) }

  before do
    the_run
    team_member
  end

  it "changes the registration policy" do
    original_registration_policy_id = event.registration_policy_id
    result = subject.call

    assert result.success?
    event.reload
    # Not equivalent_to? -- new_registration_policy here describes an entirely new set of bucket
    # keys with no ids at all, so it can never be "equivalent" (by id) to anything, including the
    # very policy it was used to build. Check that the requested keys actually took effect instead.
    assert_equal new_registration_policy.buckets.map(&:key).sort, event.registration_policy.buckets.map(&:key).sort
    assert_equal original_registration_policy_id, event.registration_policy_id
  end

  describe "when a bucket's key is unchanged" do
    let(:event) do
      create(
        :event,
        convention: convention,
        registration_policy:
          RegistrationPolicy.build_from_hash(
            buckets: [{ key: "dogs", name: "Dogs (old)", slots_limited: true, total_slots: 3 }]
          )
      )
    end

    it "preserves that bucket's row id while updating its other attributes" do
      original_bucket_id = event.registration_policy.buckets.find_by!(key: "dogs").id

      result = subject.call
      assert result.success?

      event.reload
      dogs_bucket = event.registration_policy.buckets.find_by!(key: "dogs")
      assert_equal original_bucket_id, dogs_bucket.id
      assert_equal "Dogs", dogs_bucket.name
      assert_equal 1, dogs_bucket.total_slots
    end
  end

  it "does not email the team members if nobody moved" do
    perform_enqueued_jobs do
      subject.call!
      assert_equal 0, ActionMailer::Base.deliveries.size
    end
  end

  describe "with existing signups in buckets that will be removed" do
    subject do
      EventChangeRegistrationPolicyService.new(
        event,
        new_registration_policy,
        whodunit,
        [{ from_key: "unlimited", to_key: nil }]
      )
    end

    let(:user_con_profile) { create(:user_con_profile, convention: convention) }
    let(:signup) do
      create(
        :signup,
        user_con_profile: user_con_profile,
        requested_bucket_id: bucket_with_key(event.registration_policy, "unlimited").id,
        bucket_id: bucket_with_key(event.registration_policy, "unlimited").id,
        run: the_run
      )
    end

    before { signup }

    it "moves the signup" do
      # The "unlimited" bucket is being removed by this policy change, so it will be destroyed by
      # the time the service returns; capture its id up front since SignupMoveResult#prev_bucket
      # can no longer resolve a full bucket object for a bucket that no longer exists.
      unlimited_bucket_id = bucket_with_key(event.registration_policy, "unlimited").id

      result = subject.call

      assert result.success?
      assert_equal 1, result.move_results.size
      assert_equal signup.id, result.move_results.first.signup_id
      assert_equal "anything", result.move_results.first.bucket&.key
      assert_equal unlimited_bucket_id, result.move_results.first.prev_bucket_id
      assert_nil result.move_results.first.prev_bucket
      assert_equal "Signups", result.move_results.first.prev_bucket_name
      assert_equal "confirmed", result.move_results.first.state
      assert_equal "confirmed", result.move_results.first.prev_state
      assert_equal "anything", signup.reload.bucket&.key
    end

    it "emails the team members" do
      perform_enqueued_jobs do
        subject.call!

        assert_equal 1, ActionMailer::Base.deliveries.size
        recipients = ActionMailer::Base.deliveries.map(&:to)
        assert_equal [[team_member.user_con_profile.email]], recipients
      end
    end
  end

  describe "with existing signups in buckets that will shrink" do
    let(:event) do
      create(
        :event,
        convention: convention,
        registration_policy:
          RegistrationPolicy.build_from_hash(
            buckets: [
              { key: "dogs", name: "Dogs", slots_limited: true, total_slots: 2 },
              { key: "cats", name: "Cats", slots_limited: true, total_slots: 1 },
              { key: "anything", name: "Anything", slots_limited: true, total_slots: 1, anything: true }
            ]
          )
      )
    end

    let(:user_con_profile1) { create(:user_con_profile, convention: convention) }
    let(:user_con_profile2) { create(:user_con_profile, convention: convention) }

    let(:signup1) do
      create(
        :signup,
        user_con_profile: user_con_profile1,
        requested_bucket_id: bucket_with_key(event.registration_policy, "dogs").id,
        bucket_id: bucket_with_key(event.registration_policy, "dogs").id,
        run: the_run
      )
    end
    let(:signup2) do
      create(
        :signup,
        user_con_profile: user_con_profile2,
        requested_bucket_id: bucket_with_key(event.registration_policy, "dogs").id,
        bucket_id: bucket_with_key(event.registration_policy, "dogs").id,
        run: the_run
      )
    end

    before do
      signup1
      signup2
    end

    it "moves the overflow signups" do
      result = subject.call

      assert result.success?
      assert_equal 1, result.move_results.size
      assert_equal signup2.id, result.move_results.first.signup_id
      assert_equal "anything", result.move_results.first.bucket&.key
      assert_equal "dogs", result.move_results.first.prev_bucket&.key
      assert_equal "confirmed", result.move_results.first.state
      assert_equal "confirmed", result.move_results.first.prev_state

      assert_equal "dogs", signup1.reload.bucket&.key
      assert_equal "anything", signup2.reload.bucket&.key
    end

    it "emails the team members" do
      perform_enqueued_jobs do
        subject.call!

        assert_equal 1, ActionMailer::Base.deliveries.size
        recipients = ActionMailer::Base.deliveries.map(&:to)
        assert_equal [[team_member.user_con_profile.email]], recipients
      end
    end

    describe "with no-preference signups" do
      let(:signup2) do
        create(
          :signup,
          user_con_profile: user_con_profile2,
          requested_bucket_id: nil,
          bucket_id: bucket_with_key(event.registration_policy, "anything").id,
          run: the_run
        )
      end

      let(:user_con_profile3) { create(:user_con_profile, convention: convention) }
      let(:signup3) do
        create(
          :signup,
          user_con_profile: user_con_profile3,
          requested_bucket_id: nil,
          bucket_id: bucket_with_key(event.registration_policy, "dogs").id,
          run: the_run
        )
      end

      before do
        signup1
        signup2
        signup3
      end

      it "moves them wherever it can" do
        result = subject.call

        assert result.success?
        assert_equal 1, result.move_results.size
        assert_equal signup3.id, result.move_results.first.signup_id
        assert_equal "cats", result.move_results.first.bucket&.key
        assert_equal "dogs", result.move_results.first.prev_bucket&.key
        assert_equal "confirmed", result.move_results.first.state
        assert_equal "confirmed", result.move_results.first.prev_state

        assert_equal "dogs", signup1.reload.bucket&.key
        assert_equal "anything", signup2.reload.bucket&.key
        assert_equal "cats", signup3.reload.bucket&.key
      end

      it "emails the team members" do
        perform_enqueued_jobs do
          subject.call!

          assert_equal 1, ActionMailer::Base.deliveries.size
          recipients = ActionMailer::Base.deliveries.map(&:to)
          assert_equal [[team_member.user_con_profile.email]], recipients
        end
      end
    end

    describe "with an impossible situation" do
      let(:user_con_profile3) { create(:user_con_profile, convention: convention) }
      let(:signup3) do
        create(
          :signup,
          user_con_profile: user_con_profile3,
          requested_bucket_id: bucket_with_key(event.registration_policy, "dogs").id,
          bucket_id: bucket_with_key(event.registration_policy, "anything").id,
          run: the_run
        )
      end

      before do
        signup1
        signup2
        signup3
      end

      it "fails" do
        result = subject.call

        assert result.failure?
        assert_match(
          /\ASignup for #{user_con_profile3.name_without_nickname} would no longer fit/,
          result.errors.full_messages.join("\n")
        )
        assert_equal "dogs", signup1.reload.bucket&.key
        assert_equal "dogs", signup2.reload.bucket&.key
        assert_equal "anything", signup3.reload.bucket&.key
        assert_not event.reload.registration_policy.equivalent_to?(new_registration_policy)
      end
    end
  end

  describe "with a removed bucket mapped to no preference, and no flex bucket in the new policy" do
    let(:new_registration_policy) do
      build_edited_registration_policy(event, [{ key: "dogs", name: "Dogs", slots_limited: true, total_slots: 1 }])
    end

    let(:event) do
      create(
        :event,
        convention: convention,
        registration_policy:
          RegistrationPolicy.build_from_hash(
            buckets: [
              { key: "unlimited", name: "Unlimited", slots_limited: false },
              { key: "dogs", name: "Dogs", slots_limited: true, total_slots: 1 }
            ]
          )
      )
    end

    subject do
      EventChangeRegistrationPolicyService.new(
        event,
        new_registration_policy,
        whodunit,
        [{ from_key: "unlimited", to_key: nil }]
      )
    end

    let(:user_con_profile) { create(:user_con_profile, convention: convention) }
    let(:signup) do
      create(
        :signup,
        user_con_profile: user_con_profile,
        requested_bucket_id: bucket_with_key(event.registration_policy, "unlimited").id,
        bucket_id: bucket_with_key(event.registration_policy, "unlimited").id,
        run: the_run
      )
    end

    before { signup }

    it "moves the signup into a counted bucket instead of reporting it immovable" do
      result = subject.call

      assert result.success?
      assert_equal "dogs", signup.reload.bucket&.key
      assert_nil signup.reload.requested_bucket&.key
    end
  end

  describe "when bucket keys are removed and records reference the old keys" do
    let(:event) do
      create(
        :event,
        convention: convention,
        registration_policy:
          RegistrationPolicy.build_from_hash(
            buckets: [
              { key: "unlimited", name: "Unlimited", slots_limited: false },
              { key: "dogs", name: "Dogs", slots_limited: true, total_slots: 2 }
            ]
          )
      )
    end

    let(:user_con_profile) { create(:user_con_profile, convention: convention) }
    let(:signup) do
      create(
        :signup,
        user_con_profile: user_con_profile,
        requested_bucket_id: bucket_with_key(event.registration_policy, "unlimited").id,
        bucket_id: bucket_with_key(event.registration_policy, "unlimited").id,
        run: the_run
      )
    end

    let(:signup_request_user_con_profile) { create(:user_con_profile, convention: convention) }
    let(:signup_request) do
      create(
        :signup_request,
        user_con_profile: signup_request_user_con_profile,
        requested_bucket_id: bucket_with_key(event.registration_policy, "unlimited").id,
        target_run: the_run
      )
    end

    let(:ranked_choice_user_con_profile) { create(:user_con_profile, convention: convention) }
    let(:signup_ranked_choice) do
      create(
        :signup_ranked_choice,
        user_con_profile: ranked_choice_user_con_profile,
        requested_bucket_id: bucket_with_key(event.registration_policy, "unlimited").id,
        target_run: the_run
      )
    end

    before do
      signup
      signup_request
      signup_ranked_choice
    end

    describe "without bucket_key_mappings" do
      it "fails with an error about the missing mapping" do
        result = subject.call

        assert result.failure?
        assert_match(
          /\ABucket key "unlimited" was removed but no mapping was provided/,
          result.errors.full_messages.join("\n")
        )
        assert_equal "unlimited", signup.reload.requested_bucket&.key
        assert_equal "unlimited", signup_request.reload.requested_bucket&.key
        assert_equal "unlimited", signup_ranked_choice.reload.requested_bucket&.key
      end
    end

    describe "with bucket_key_mappings mapping to a new bucket" do
      subject do
        EventChangeRegistrationPolicyService.new(
          event,
          new_registration_policy,
          whodunit,
          [{ from_key: "unlimited", to_key: "dogs" }]
        )
      end

      it "updates requested_bucket_key on affected records to the mapped bucket" do
        subject.call!

        assert_equal "dogs", signup.reload.requested_bucket&.key
        assert_equal "dogs", signup_request.reload.requested_bucket&.key
        assert_equal "dogs", signup_ranked_choice.reload.requested_bucket&.key
      end
    end

    describe "with bucket_key_mappings mapping to nil (no preference)" do
      subject do
        EventChangeRegistrationPolicyService.new(
          event,
          new_registration_policy,
          whodunit,
          [{ from_key: "unlimited", to_key: nil }]
        )
      end

      it "sets requested_bucket_key to nil on affected records" do
        subject.call!

        assert_nil signup.reload.requested_bucket&.key
        assert_nil signup_request.reload.requested_bucket&.key
        assert_nil signup_ranked_choice.reload.requested_bucket&.key
      end
    end

    describe "with bucket_key_mappings mapping to nil, when the new policy disallows no-preference signups" do
      let(:new_registration_policy) do
        build_edited_registration_policy(
          event,
          [
            { key: "dogs", name: "Dogs", slots_limited: true, total_slots: 1 },
            { key: "cats", name: "Cats", slots_limited: true, total_slots: 1 },
            { key: "anything", name: "Anything", slots_limited: true, total_slots: 1, anything: true }
          ],
          prevent_no_preference_signups: true
        )
      end

      subject do
        EventChangeRegistrationPolicyService.new(
          event,
          new_registration_policy,
          whodunit,
          [{ from_key: "unlimited", to_key: nil }]
        )
      end

      it "fails instead of leaving affected records with a disallowed no-preference state" do
        result = subject.call

        assert result.failure?
        assert_match(
          /\ABucket key "unlimited" cannot be mapped to "no preference"/,
          result.errors.full_messages.join("\n")
        )
        assert_equal "unlimited", signup.reload.requested_bucket&.key
        assert_equal "unlimited", signup_request.reload.requested_bucket&.key
        assert_equal "unlimited", signup_ranked_choice.reload.requested_bucket&.key
      end
    end
  end

  describe "with existing signups in buckets that will grow" do
    let(:event) do
      create(
        :event,
        convention: convention,
        registration_policy:
          RegistrationPolicy.build_from_hash(
            buckets: [
              { key: "dogs", name: "Dogs", slots_limited: true, total_slots: 0 },
              { key: "cats", name: "Cats", slots_limited: true, total_slots: 1 },
              { key: "anything", name: "Anything", slots_limited: true, total_slots: 1, anything: true }
            ]
          )
      )
    end

    let(:user_con_profile1) { create(:user_con_profile, convention: convention) }
    let(:user_con_profile2) { create(:user_con_profile, convention: convention) }

    let(:signup1) do
      create(
        :signup,
        user_con_profile: user_con_profile1,
        requested_bucket_id: bucket_with_key(event.registration_policy, "dogs").id,
        bucket_id: bucket_with_key(event.registration_policy, "anything").id,
        run: the_run
      )
    end
    let(:signup2) do
      create(
        :signup,
        user_con_profile: user_con_profile2,
        state: "waitlisted",
        requested_bucket_id: bucket_with_key(event.registration_policy, "dogs").id,
        bucket_id: nil,
        run: the_run
      )
    end

    before do
      signup1
      signup2
    end

    it "tries not to move confirmed signups" do
      result = subject.call

      assert result.success?
      assert_equal "anything", signup1.reload.bucket&.key
    end

    it "pulls in waitlisted signups" do
      result = subject.call

      assert result.success?
      assert_equal "dogs", signup2.reload.bucket&.key
      assert_equal "confirmed", signup2.reload.state
    end

    it "emails the team members and the attendees who got pulled in" do
      perform_enqueued_jobs do
        subject.call!

        assert_equal 2, ActionMailer::Base.deliveries.size
        recipients = ActionMailer::Base.deliveries.map(&:to)
        assert_equal [[user_con_profile2.email], [team_member.user_con_profile.email]], recipients
      end
    end
  end
end
