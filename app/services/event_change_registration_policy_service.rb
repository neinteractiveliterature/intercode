class EventChangeRegistrationPolicyService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :move_results
  end
  self.result_class = Result

  class SignupSimulator
    attr_reader :registration_policy, :move_results_by_signup_id, :immovable_signups,
      :new_signups_by_signup_id
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
      # Signups that are confirmed with no bucket can't possibly be affected by a registration
      # policy change; just put them right into the signup list without simulating anything
      to_keep, to_place = signups.partition do |signup|
        signup.confirmed? && !signup.bucket_key
      end

      to_keep.each do |signup|
        new_signups_by_signup_id[signup.id] = signup
      end

      to_place.each { |signup| simulate_signup signup }
    end

    def simulate_signup(signup)
      bucket_finder = SignupBucketFinder.new(
        registration_policy,
        signup.requested_bucket_key,
        new_signups_by_signup_id.values,
        allow_movement: true
      )

      # Try to put them in the bucket they're already in if possible
      current_bucket = signup.bucket_key ? registration_policy.bucket_with_key(signup.bucket_key) : nil
      destination_bucket = if current_bucket && !current_bucket.full?(new_signups_by_signup_id.values)
        current_bucket
      else
        bucket_finder.find_bucket
      end

      if !destination_bucket
        if signup.confirmed?
          immovable_signups << signup
          log_immovable_signup(signup)
        end
      else
        place_signup signup, bucket_finder, destination_bucket
      end

      log_bucket_counts
    end

    private

    def place_signup(signup, bucket_finder, destination_bucket)
      unless destination_bucket.key == signup.bucket_key
        build_move_result(signup, destination_bucket)
      end

      if destination_bucket && destination_bucket.full?(new_signups_by_signup_id.values)
        move_signup(bucket_finder.no_preference_bucket_finder, destination_bucket)
      end

      new_signup = signup.dup
      new_signup.assign_attributes(
        bucket_key: destination_bucket.key,
        state: 'confirmed',
        counted: destination_bucket.counted?
      )
      new_signups_by_signup_id[signup.id] = new_signup
      log_signup_placement(signup, destination_bucket)
    end

    def build_move_result(signup, destination_bucket)
      move_results_by_signup_id[signup.id] = SignupMoveResult.new(
        signup.id,
        'confirmed',
        destination_bucket.key,
        signup.state,
        signup.bucket_key
      )
    end

    def move_signup(no_preference_bucket_finder, from_bucket)
      movable_signup = no_preference_bucket_finder.movable_signups_for_bucket(from_bucket).first
      destination_bucket = no_preference_bucket_finder
        .prioritized_buckets_with_capacity_except(from_bucket)
        .first

      build_move_result(movable_signup, destination_bucket)
      log "Moving signup for #{movable_signup.user_con_profile.name_without_nickname} to \
#{destination_bucket.key}"

      movable_signup.bucket_key = destination_bucket.key
      movable_signup
    end

    def log(message)
      logger.debug(message) if logger
    end

    def log_immovable_signup(signup)
      return unless logger
      log "Signup for #{signup.user_con_profile.name_without_nickname} \
(#{signup.requested_bucket_key}) is immovable"
    end

    def log_signup_placement(signup, destination_bucket)
      return unless logger

      if destination_bucket.key == signup.bucket_key
        log "Signup for #{signup.user_con_profile.name_without_nickname} remains in \
#{destination_bucket.key}"
      else
        log "Signup for #{signup.user_con_profile.name_without_nickname} placed in \
#{destination_bucket.key} (was #{signup.bucket_key})"
      end
    end

    def log_bucket_counts
      return unless logger

      bucket_counts = registration_policy.buckets.map do |bucket|
        signup_count = new_signups_by_signup_id.values.select do |signup|
          signup.bucket_key == bucket.key && signup.counted?
        end.size
        "#{bucket.key}: #{signup_count}/#{bucket.total_slots}"
      end
      log "Counts: [#{bucket_counts.join(' | ')}]"
      log
    end
  end

  include SkippableAdvisoryLock

  attr_reader :event, :new_registration_policy, :whodunit, :move_results

  def initialize(event, new_registration_policy, whodunit)
    @event = event
    @new_registration_policy = new_registration_policy
    @whodunit = whodunit
    @move_results = []
  end

  private

  def inner_call
    lock_all_runs do
      immovable_signups, new_signups_by_signup_id = simulate_signups

      if immovable_signups.any?
        immovable_signups.each do |signup|
          errors.add(
            :base,
            "Signup for #{signup.user_con_profile.name_without_nickname} would no longer fit"
          )
        end

        return failure(errors)
      else
        apply_all_changes new_signups_by_signup_id
      end

      event.allow_registration_policy_change = true
      event.update!(registration_policy: new_registration_policy)
    end

    notify_move_results
    success(move_results: move_results)
  end

  def simulate_signups
    immovable_signups = []
    new_signups_by_signup_id = {}

    event.runs.each do |run|
      simulator = SignupSimulator.new(new_registration_policy)
      simulator.simulate_signups(signups_by_run_id[run.id] || [])

      new_signups_by_signup_id.update(simulator.new_signups_by_signup_id)
      immovable_signups.concat(simulator.immovable_signups)
    end

    [immovable_signups, new_signups_by_signup_id]
  end

  def apply_all_changes(new_signups_by_signup_id)
    signups_by_id = all_signups.index_by(&:id)
    new_signups_by_signup_id.each do |signup_id, new_signup|
      signup = signups_by_id[signup_id]
      check_for_move signup, new_signup
      apply_changes_for_signup signup, new_signup
    end
  end

  def apply_changes_for_signup(signup, new_signup)
    identical = (
      new_signup.state == signup.state &&
      new_signup.bucket_key == signup.bucket_key &&
      new_signup.counted == signup.counted
    )
    return if identical

    # Do a direct SQL update, bypassing validations, since we haven't updated
    # the registration policy yet
    signup.update_columns(
      state: new_signup.state,
      bucket_key: new_signup.bucket_key,
      counted: new_signup.counted
    )
  end

  def check_for_move(signup, new_signup)
    return unless new_signup.state != signup.state || new_signup.bucket_key != signup.bucket_key

    move_result = SignupMoveResult.new(
      signup.id,
      new_signup.state,
      new_signup.bucket_key,
      signup.state,
      signup.bucket_key
    )
    move_results << move_result
  end

  def notify_move_results
    move_results.each do |move_result|
      notify_moved_signup(move_result) if move_result.should_notify?
    end

    notify_team_members(move_results)
  end

  def notify_moved_signup(result)
    EventSignups::UserSignupMovedNotifier.new(move_result: result).deliver_later
  end

  def notify_team_members(move_results)
    return unless move_results.any?

    EventSignups::RegistrationPolicyChangeMovedSignupsNotifier.new(
      event: event,
      move_results: move_results,
      whodunit: whodunit
    ).deliver_later
  end

  def all_signups
    @all_signups ||= Signup.where.not(state: 'withdrawn')
      .joins(:run).includes(:user_con_profile).where(runs: { event_id: event.id }).to_a
  end

  def signups_by_run_id
    @signups_by_run_id ||= all_signups.group_by(&:run_id)
      .transform_values { |signups| signups.sort_by { |signup| [signup.confirmed? ? 0 : 1, signup.created_at] } }
  end

  def lock_all_runs(&block)
    event.runs.inject(block) do |memo, acc|
      -> { with_advisory_lock_unless_skip_locking("run_#{acc.id}_signups", &memo) }
    end.call
  end
end
