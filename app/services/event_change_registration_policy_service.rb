class EventChangeRegistrationPolicyService < ApplicationService
  class Result < ServiceResult
    attr_accessor :move_results
  end
  self.result_class = Result

  class SignupSimulator
    attr_reader :registration_policy, :move_results_by_signup_id, :immovable_signups, :new_signups_by_signup_id
    attr_accessor :logger

    def initialize(registration_policy)
      @registration_policy = registration_policy
      @move_results_by_signup_id = {}
      @immovable_signups = []
      @new_signups_by_signup_id = {}
    end

    def success?
      immovable_signups.empty?
    end

    def move_results
      move_results_by_signup_id.values
    end

    def simulate_signups(signups)
      signups.each { |signup| simulate_signup signup }
    end

    def simulate_signup(signup)
      if signup.confirmed? && !signup.bucket_key
        new_signups_by_signup_id[signup.id] = signup
        return
      end

      destination_bucket = SignupBucketFinder.new(
        registration_policy,
        signup.requested_bucket_key,
        new_signups_by_signup_id.values,
        allow_movement: true
      ).find_bucket

      if !destination_bucket
        if signup.confirmed?
          immovable_signups << signup
          log_immovable_signup(signup)
        end
      else
        build_move_result(signup, destination_bucket) unless destination_bucket.key == signup.bucket_key
        move_signup(destination_bucket) if destination_bucket && destination_bucket.full?(new_signups_by_signup_id.values)

        new_signup = signup.dup
        new_signup.assign_attributes(
          bucket_key: destination_bucket.key,
          state: 'confirmed',
          counted: destination_bucket.counted?
        )
        new_signups_by_signup_id[signup.id] = new_signup
        log_signup_placement(signup, destination_bucket)
      end

      log_bucket_counts(signup)
    end

    private

    def build_move_result(signup, destination_bucket)
      move_results_by_signup_id[signup.id] = SignupMoveResult.new(
        signup.id,
        'confirmed',
        destination_bucket.key,
        signup.state,
        signup.bucket_key
      )
    end

    def move_signup(from_bucket)
      bucket_finder = SignupBucketFinder.new(
        registration_policy,
        nil,
        new_signups_by_signup_id.values,
        allow_movement: true
      )

      movable_signup = bucket_finder.movable_signups_for_bucket(from_bucket).first
      destination_bucket = bucket_finder.prioritized_buckets_with_capacity_except(from_bucket).first

      build_move_result(movable_signup, destination_bucket)
      puts "Moving signup for #{movable_signup.user_con_profile.name_without_nickname} to #{destination_bucket.key}"

      movable_signup.bucket_key = destination_bucket.key
      movable_signup
    end

    def log(message)
      logger.debug(message) if logger
    end

    def log_immovable_signup(signup)
      return unless logger
      log "Signup for #{signup.user_con_profile.name_without_nickname} (#{signup.requested_bucket_key}) is immovable"
    end

    def log_signup_placement(signup, destination_bucket)
      return unless logger

      if destination_bucket.key == signup.bucket_key
        log "Signup for #{signup.user_con_profile.name_without_nickname} remains in #{destination_bucket.key}"
      else
        log "Signup for #{signup.user_con_profile.name_without_nickname} placed in #{destination_bucket.key} (was #{signup.bucket_key})"
      end
    end

    def log_bucket_counts(signup)
      return unless logger

      bucket_counts = registration_policy.buckets.map do |bucket|
        "#{bucket.key}: #{new_signups_by_signup_id.values.select { |signup| signup.bucket_key == bucket.key && signup.counted? }.size}/#{bucket.total_slots}"
      end
      log "Counts: [#{bucket_counts.join(' | ')}]"
      log
    end
  end

  attr_reader :event, :new_registration_policy, :whodunit

  def initialize(event, new_registration_policy, whodunit)
    @event = event
    @new_registration_policy = new_registration_policy
    @whodunit = whodunit
  end

  private

  def inner_call
    new_signups_by_signup_id = {}
    move_results = []

    lock_all_runs do
      immovable_signups = []

      all_signups = Signup.where.not(state: 'withdrawn')
        .joins(:run).includes(:user_con_profile).where(runs: { event_id: event.id }).to_a

      signups_by_run_id = all_signups.group_by(&:run_id)
        .transform_values { |signups| signups.sort_by(&:created_at) }

      event.runs.each do |run|
        simulator = SignupSimulator.new(new_registration_policy)
        simulator.simulate_signups(signups_by_run_id[run.id] || [])

        new_signups_by_signup_id.merge(simulator.new_signups_by_signup_id)
        immovable_signups.concat(simulator.immovable_signups)
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
        signups_by_id = all_signups.index_by(&:id)
        new_signups_by_signup_id.each do |new_signup, signup_id|
          signup = signups_by_id[signup_id]
          next if new_signup.state == signup.state && new_signup.bucket_key == signup.bucket_key && new_signup.counted == signup.counted

          move_result = SignupMoveResult.new(
            signup.id,
            new_signup.state,
            new_signup.bucket_key,
            signup.state,
            signup.bucket_key
          )
          move_results << move_results

          signup.update!(
            state: new_signup.state,
            bucket_key: new_signup.bucket_key,
            counted: new_signup.counted
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
