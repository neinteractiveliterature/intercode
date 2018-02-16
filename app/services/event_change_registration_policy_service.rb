class EventChangeRegistrationPolicyService < ApplicationService
  class Result < ServiceResult
    attr_accessor :move_results
  end
  self.result_class = Result

  attr_reader :event, :new_registration_policy, :whodunit

  def initialize(event, new_registration_policy, whodunit)
    @event = event
    @new_registration_policy = new_registration_policy
    @whodunit = whodunit
  end

  private

  def inner_call
    move_results = []

    lock_all_runs do
      immovable_signups = []

      all_signups = Signup.where.not(state: 'withdrawn').counted
        .joins(:run).where(runs: { event_id: event.id }).to_a

      signups_by_run_id = all_signups.group_by(&:run_id)
        .transform_values { |signups| signups.sort_by(&:created_at) }

      event.runs.each do |run|
        run_signups = signups_by_run_id[run.id] || []
        run_move_results, run_immovable_signups = apply_registration_policy_for_run_signups(
          run_signups
        )

        move_results.concat(run_move_results)
        immovable_signups.concat(run_immovable_signups)
      end

      if immovable_signups.any?
        immovable_signups.each do |signup|
          errors.add(
            :base,
            "Signup for #{signup.user_con_profile.name_without_nickname} would no longer fit"
          )
        end

        return failure(errors)
      else
        move_results.each do |move_result|
          Signup.where(id: move_result.signup_id).update_all(
            bucket_key: move_result.bucket_key,
            state: move_result.state
          )

          notify_moved_signup(move_result) if move_result.should_notify?
        end
      end

      @event.allow_registration_policy_change = true
      @event.update!(registration_policy: new_registration_policy)
    end

    notify_team_members(move_results)
    success(move_results: move_results)
  end

  def apply_registration_policy_for_run_signups(run_signups)
    move_results = []
    immovable_signups = []
    new_signups = []

    run_signups.each do |signup|
      destination_bucket = SignupBucketFinder.new(
        new_registration_policy,
        signup.requested_bucket_key,
        new_signups,
        allow_movement: false
      ).find_bucket

      if !destination_bucket && signup.confirmed?
        immovable_signups << signup
      elsif destination_bucket.key == signup.bucket_key
        new_signups << signup
      else
        move_results << SignupMoveResult.new(
          signup.id,
          'confirmed',
          destination_bucket.key,
          signup.state,
          signup.bucket_key
        )

        new_signup = signup.dup
        new_signup.assign_attributes(
          bucket_key: destination_bucket.key,
          state: 'confirmed'
        )
        new_signups << new_signup
      end
    end

    [move_results, immovable_signups]
  end

  def notify_moved_signup(result)
    EventSignupMailer.user_signup_moved(result.to_h).deliver_later
  end

  def notify_team_members(move_results)
    return unless move_results.any?

    event.team_members.where(receive_signup_email: true).find_each do |team_member|
      EventSignupMailer.registration_policy_change_moved_signups(
        event,
        move_results.map(&:to_h),
        team_member,
        whodunit
      ).deliver_later
    end
  end

  def lock_all_runs(&block)
    event.runs.inject(block) do |memo, acc|
      -> { with_advisory_lock_unless_skip_locking("run_#{acc.id}_signups", &memo) }
    end.call
  end
end
