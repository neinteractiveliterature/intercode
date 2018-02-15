require 'test_helper'

class EventChangeRegistrationPolicyServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  let(:event) { FactoryBot.create :event }
  let(:the_run) { FactoryBot.create :run, event: event }
  let(:convention) { event.convention }
  let(:new_registration_policy) do
    RegistrationPolicy.new(
      buckets: [
        { key: 'dogs', slots_limited: true, total_slots: 1 },
        { key: 'cats', slots_limited: true, total_slots: 1 },
        { key: 'anything', slots_limited: true, total_slots: 1, anything: true }
      ]
    )
  end

  subject { EventChangeRegistrationPolicyService.new(event, new_registration_policy) }

  before do
    the_run
  end

  it 'changes the registration policy' do
    result = subject.call

    result.must_be :success?
    event.reload.registration_policy.must_equal new_registration_policy
  end

  describe 'with existing signups in buckets that will be removed' do
    let(:user_con_profile) { FactoryBot.create :user_con_profile, convention: convention }
    let(:signup) do
      FactoryBot.create(
        :signup,
        user_con_profile: user_con_profile,
        requested_bucket_key: 'unlimited',
        bucket_key: 'unlimited',
        run: the_run
      )
    end

    before do
      signup
    end

    it 'moves the signup' do
      result = subject.call

      result.must_be :success?
      result.move_results.size.must_equal 1
      result.move_results.first.signup_id.must_equal signup.id
      result.move_results.first.bucket_key.must_equal 'anything'
      result.move_results.first.prev_bucket_key.must_equal 'unlimited'
      result.move_results.first.state.must_equal 'confirmed'
      result.move_results.first.prev_state.must_equal 'confirmed'
      signup.reload.bucket_key.must_equal 'anything'
    end
  end

  describe 'with existing signups in buckets that will shrink' do
    let(:event) do
      FactoryBot.create(
        :event,
        registration_policy: RegistrationPolicy.new(
          buckets: [
            { key: 'dogs', slots_limited: true, total_slots: 2 },
            { key: 'cats', slots_limited: true, total_slots: 1 },
            { key: 'anything', slots_limited: true, total_slots: 1, anything: true }
          ]
        )
      )
    end

    let(:user_con_profile1) { FactoryBot.create :user_con_profile, convention: convention }
    let(:user_con_profile2) { FactoryBot.create :user_con_profile, convention: convention }

    let(:signup1) do
      FactoryBot.create(
        :signup,
        user_con_profile: user_con_profile1,
        requested_bucket_key: 'dogs',
        bucket_key: 'dogs',
        run: the_run
      )
    end
    let(:signup2) do
      FactoryBot.create(
        :signup,
        user_con_profile: user_con_profile2,
        requested_bucket_key: 'dogs',
        bucket_key: 'dogs',
        run: the_run
      )
    end

    before do
      signup1
      signup2
    end

    it 'moves the overflow signups' do
      result = subject.call

      result.must_be :success?
      result.move_results.size.must_equal 1
      result.move_results.first.signup_id.must_equal signup2.id
      result.move_results.first.bucket_key.must_equal 'anything'
      result.move_results.first.prev_bucket_key.must_equal 'dogs'
      result.move_results.first.state.must_equal 'confirmed'
      result.move_results.first.prev_state.must_equal 'confirmed'

      signup1.reload.bucket_key.must_equal 'dogs'
      signup2.reload.bucket_key.must_equal 'anything'
    end

    describe 'with no-preference signups' do
      let(:signup2) do
        FactoryBot.create(
          :signup,
          user_con_profile: user_con_profile2,
          requested_bucket_key: nil,
          bucket_key: 'anything',
          run: the_run
        )
      end

      let(:user_con_profile3) { FactoryBot.create :user_con_profile, convention: convention }
      let(:signup3) do
        FactoryBot.create(
          :signup,
          user_con_profile: user_con_profile3,
          requested_bucket_key: nil,
          bucket_key: 'dogs',
          run: the_run
        )
      end

      before do
        signup1
        signup2
        signup3
      end

      it 'moves them wherever it can' do
        result = subject.call

        result.must_be :success?
        result.move_results.size.must_equal 1
        result.move_results.first.signup_id.must_equal signup3.id
        result.move_results.first.bucket_key.must_equal 'cats'
        result.move_results.first.prev_bucket_key.must_equal 'dogs'
        result.move_results.first.state.must_equal 'confirmed'
        result.move_results.first.prev_state.must_equal 'confirmed'

        signup1.reload.bucket_key.must_equal 'dogs'
        signup2.reload.bucket_key.must_equal 'anything'
        signup3.reload.bucket_key.must_equal 'cats'
      end
    end

    describe 'with an impossible situation' do
      let(:user_con_profile3) { FactoryBot.create :user_con_profile, convention: convention }
      let(:signup3) do
        FactoryBot.create(
          :signup,
          user_con_profile: user_con_profile3,
          requested_bucket_key: 'dogs',
          bucket_key: 'anything',
          run: the_run
        )
      end

      before do
        signup1
        signup2
        signup3
      end

      it 'fails' do
        result = subject.call

        result.must_be :failure?
        result.errors.full_messages.join("\n").must_match /\ASignup for #{user_con_profile3.name_without_nickname} would no longer fit/
        signup1.reload.bucket_key.must_equal 'dogs'
        signup2.reload.bucket_key.must_equal 'dogs'
        signup3.reload.bucket_key.must_equal 'anything'
        event.reload.registration_policy.wont_equal new_registration_policy
      end
    end
  end

  describe 'with existing signups in buckets that will grow' do
    let(:event) do
      FactoryBot.create(
        :event,
        registration_policy: RegistrationPolicy.new(
          buckets: [
            { key: 'dogs', slots_limited: true, total_slots: 0 },
            { key: 'cats', slots_limited: true, total_slots: 1 },
            { key: 'anything', slots_limited: true, total_slots: 1, anything: true }
          ]
        )
      )
    end

    let(:user_con_profile1) { FactoryBot.create :user_con_profile, convention: convention }
    let(:user_con_profile2) { FactoryBot.create :user_con_profile, convention: convention }

    let(:signup1) do
      FactoryBot.create(
        :signup,
        user_con_profile: user_con_profile1,
        requested_bucket_key: 'dogs',
        bucket_key: 'anything',
        run: the_run
      )
    end
    let(:signup2) do
      FactoryBot.create(
        :signup,
        user_con_profile: user_con_profile2,
        state: 'waitlisted',
        requested_bucket_key: 'dogs',
        bucket_key: nil,
        run: the_run
      )
    end

    before do
      signup1
      signup2
    end

    it 'moves confirmed signups' do
      result = subject.call

      result.must_be :success?
      signup1.reload.bucket_key.must_equal 'dogs'
    end

    it 'pulls in waitlisted signups' do
      perform_enqueued_jobs do
        result = subject.call

        result.must_be :success?
        signup2.reload.bucket_key.must_equal 'anything'
        signup2.reload.state.must_equal 'confirmed'

        ActionMailer::Base.deliveries.size.must_equal 1
        recipients = ActionMailer::Base.deliveries.map(&:to)
        recipients.must_equal [[user_con_profile2.email]]
      end
    end
  end
end
