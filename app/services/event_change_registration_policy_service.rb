# frozen_string_literal: true
class EventChangeRegistrationPolicyService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :move_results
  end
  self.result_class = Result

  # Deliberately key-based throughout: registration_policy here is new_registration_policy, a
  # detached policy built via RegistrationPolicy.build_from_hash that hasn't been persisted yet, so
  # its candidate buckets have no id (existing keys will get their old, stable id back once
  # update_from! persists them in place; genuinely new keys get an id for the first time). Key is
  # the only identity valid on both real signups and these not-yet-persisted candidate buckets.
  class SignupSimulator
    attr_reader :registration_policy, :immovable_signups, :new_signups_by_signup_id
    attr_accessor :logger

    # Sentinel distinguishing "no override was supplied for this signup" from "the override is
    # explicitly nil" (i.e. clear the requested bucket) -- a bare `nil` default can't tell those
    # apart, which previously caused a cleared preference to fall back to the removed bucket's key.
    NO_OVERRIDE = Object.new.freeze
    private_constant :NO_OVERRIDE

    def initialize(registration_policy)
      @registration_policy = registration_policy
      @immovable_signups = []
      @new_signups_by_signup_id = {}
    end

    def simulate_signups(signups, requested_key_overrides: {})
      # Signups that are occupying a slot with no bucket can't possibly be affected by a registration
      # policy change; just put them right into the signup list without simulating anything
      to_keep, to_place = signups.partition { |signup| signup.occupying_slot? && !signup.bucket_key }

      to_keep.each { |signup| new_signups_by_signup_id[signup.id] = signup }

      to_place.each do |signup|
        override = requested_key_overrides.key?(signup.id) ? requested_key_overrides[signup.id] : NO_OVERRIDE
        simulate_signup(signup, override)
      end
    end

    # rubocop:disable Metrics/MethodLength, Metrics/PerceivedComplexity
    def simulate_signup(signup, requested_key_override = NO_OVERRIDE)
      requested_key = requested_key_override == NO_OVERRIDE ? signup.requested_bucket_key : requested_key_override
      bucket_finder =
        SignupBucketFinder.new(
          registration_policy,
          requested_key,
          new_signups_by_signup_id.values,
          allow_movement: true
        )

      # Try to put them in the bucket they're already in if possible
      current_bucket = (signup.bucket_key ? registration_policy.bucket_with_key(signup.bucket_key) : nil)
      destination_bucket =
        (
          if current_bucket && !current_bucket.full?(new_signups_by_signup_id.values)
            current_bucket
          else
            bucket_finder.find_bucket
          end
        )

      if destination_bucket
        place_signup signup, bucket_finder, destination_bucket
      elsif signup.occupying_slot?
        immovable_signups << signup
        log_immovable_signup(signup)
      end

      log_bucket_counts
    end

    # rubocop:enable Metrics/MethodLength, Metrics/PerceivedComplexity

    private

    def place_signup(signup, bucket_finder, destination_bucket)
      if destination_bucket&.full?(new_signups_by_signup_id.values)
        move_signup(bucket_finder.no_preference_bucket_finder, destination_bucket)
      end

      new_signup = SignupBucketFinder::FakeSignup.from_signup(signup)
      new_signup.assign_attributes(
        bucket_key: destination_bucket.key,
        state: "confirmed",
        counted: destination_bucket.counted?
      )
      new_signups_by_signup_id[signup.id] = new_signup
      log_signup_placement(signup, destination_bucket)
    end

    def move_signup(no_preference_bucket_finder, from_bucket)
      movable_signup = no_preference_bucket_finder.movable_signups_for_bucket(from_bucket).first
      destination_bucket = no_preference_bucket_finder.prioritized_buckets_with_capacity_except(from_bucket).first

      log "Moving signup for #{movable_signup.user_con_profile.name_without_nickname} to
#{destination_bucket.key}"

      movable_signup.bucket_key = destination_bucket.key
      movable_signup
    end

    def log(message)
      logger&.debug(message)
    end

    def log_immovable_signup(signup)
      return unless logger
      log "Signup for #{signup.user_con_profile.name_without_nickname} \
(#{signup.requested_bucket_key}) is immovable"
    end

    def log_signup_placement(signup, destination_bucket)
      return unless logger

      if destination_bucket.key == signup.bucket_key
        log "Signup for #{signup.user_con_profile.name_without_nickname} remains in
#{destination_bucket.key}"
      else
        log "Signup for #{signup.user_con_profile.name_without_nickname} placed in
#{destination_bucket.key} (was #{signup.bucket_key})"
      end
    end

    def log_bucket_counts
      return unless logger

      bucket_counts =
        registration_policy.buckets.map do |bucket|
          signup_count =
            new_signups_by_signup_id.values.count { |signup| signup.bucket_key == bucket.key && signup.counted? }
          "#{bucket.key}: #{signup_count}/#{bucket.total_slots}"
        end
      log "Counts: [#{bucket_counts.join(" | ")}]"
      log
    end
  end

  include SkippableAdvisoryLock

  attr_reader :event, :new_registration_policy, :whodunit, :bucket_key_mappings, :move_results

  def initialize(event, new_registration_policy, whodunit, bucket_key_mappings = nil)
    @event = event
    @new_registration_policy = new_registration_policy
    @whodunit = whodunit
    @bucket_key_mappings = (bucket_key_mappings || []).index_by { |mapping| mapping[:from_key] }
    @move_results = []
  end

  private

  def inner_call
    lock_all_runs do
      return failure(errors) if bucket_key_mapping_errors.any?

      immovable_signups, new_signups_by_signup_id = simulate_signups

      if immovable_signups.any?
        immovable_signups.each do |signup|
          errors.add(:base, "Signup for #{signup.user_con_profile.name_without_nickname} would no longer fit")
        end

        return failure(errors)
      end

      # Removed buckets are about to be destroyed below; nothing may still reference them by FK
      # (signup_changes is the only one of these that nullifies on delete) or the destroy will
      # raise a foreign key violation. Null those references out first and re-resolve them to their
      # final value afterward, once the destination bucket (surviving or brand new) has a real id.
      clear_references_to_removed_buckets

      # Only persist the new buckets once we know the simulation succeeds, so a failed simulation
      # never leaves partial changes behind. Buckets that survive the edit (matched by key) keep
      # their existing, stable id; genuinely new buckets get a real id for the first time here --
      # which is why any id resolution against them has to happen after this point.
      event.registration_policy.update_from!(new_registration_policy)

      apply_simulation_changes(new_signups_by_signup_id)
      apply_bucket_key_mappings

      move_results.each { |move_result| move_result.signup.log_signup_change!(action: "change_registration_policy") }
    end

    notify_move_results
    success(move_results: move_results)
  end

  def simulate_signups
    immovable_signups = []
    new_signups_by_signup_id = {}

    event.runs.each do |run|
      simulator = SignupSimulator.new(new_registration_policy)
      simulator.simulate_signups(
        signups_by_run_id[run.id] || [],
        requested_key_overrides: pending_requested_key_overrides
      )

      new_signups_by_signup_id.update(simulator.new_signups_by_signup_id)
      immovable_signups.concat(simulator.immovable_signups)
    end

    [immovable_signups, new_signups_by_signup_id]
  end

  def apply_simulation_changes(new_signups_by_signup_id)
    signups_by_id = all_signups.index_by(&:id)
    new_signups_by_signup_id.each do |signup_id, new_signup|
      signup = signups_by_id[signup_id]
      new_bucket_id = new_signup.bucket_key ? event.registration_policy.bucket_with_key(new_signup.bucket_key)&.id : nil
      check_for_move signup, new_signup, new_bucket_id
      apply_changes_for_signup signup, new_signup, new_bucket_id
    end
  end

  def apply_changes_for_signup(signup, new_signup, new_bucket_id)
    identical =
      new_signup.state == signup.state && new_bucket_id == signup.bucket_id && new_signup.counted == signup.counted
    return if identical

    # Do a direct SQL update, bypassing validations, since simulate_signups already confirmed this
    # signup fits
    signup.update_columns(state: new_signup.state, bucket_id: new_bucket_id, counted: new_signup.counted)
  end

  # Signups whose *requested* (not current) bucket is being removed, with an admin-supplied mapping
  # to a surviving or new bucket, need that preference fed into the simulation as an override --
  # their real requested_bucket_id can't be updated yet if the mapping targets a brand new bucket,
  # since that bucket has no id until update_from! persists it below.
  def pending_requested_key_overrides
    @pending_requested_key_overrides ||=
      all_signups.each_with_object({}) do |signup, hash|
        next unless removed_bucket_ids.include?(signup.requested_bucket_id)

        old_bucket = removed_buckets_by_id[signup.requested_bucket_id]
        next unless bucket_key_mappings.key?(old_bucket.key)

        # The mapping may point to a surviving/new bucket (to_key present) or explicitly clear the
        # preference (to_key nil/absent) -- either way, its mere presence here means "don't fall back
        # to the signup's own requested_bucket_key", which would otherwise leak the removed bucket.
        hash[signup.id] = bucket_key_mappings[old_bucket.key][:to_key]
      end
  end

  # Nulls out every bucket_id/requested_bucket_id reference to a bucket that's about to be
  # destroyed. relevant_signup_requests/relevant_signup_ranked_choices/all_signups are read here
  # (and memoized) before their rows are touched, so apply_bucket_key_mappings can still see what
  # they used to point at once it runs after update_from! persists the new buckets.
  #
  # This clears requested_bucket_id on *every* signup on the event's runs, including withdrawn ones,
  # but apply_bucket_key_mappings only re-resolves it for all_signups (which excludes withdrawn) --
  # so a withdrawn signup's requested_bucket_id ends up nil here even if a mapping was supplied for
  # its old bucket. That's a behavior change from before this bucket was FK-backed (withdrawn signups
  # used to keep a now-invalid stale key instead), but withdrawn signups don't affect capacity or
  # placement, so this is presumed harmless.
  def clear_references_to_removed_buckets
    return if removed_bucket_ids.empty?

    request_ids_to_clear =
      relevant_signup_requests.select { |request| removed_bucket_ids.include?(request.requested_bucket_id) }.map(&:id)
    choice_ids_to_clear =
      relevant_signup_ranked_choices
        .select { |choice| removed_bucket_ids.include?(choice.requested_bucket_id) }
        .map(&:id)

    run_ids = event.runs.pluck(:id)
    Signup.where(run_id: run_ids, bucket_id: removed_bucket_ids).update_all(bucket_id: nil)
    Signup.where(run_id: run_ids, requested_bucket_id: removed_bucket_ids).update_all(requested_bucket_id: nil)
    SignupRequest.where(id: request_ids_to_clear).update_all(requested_bucket_id: nil)
    SignupRankedChoice.where(id: choice_ids_to_clear).update_all(requested_bucket_id: nil)
  end

  def relevant_signup_requests
    @relevant_signup_requests ||= SignupRequest.where(target_run_id: event.runs.pluck(:id)).to_a
  end

  def relevant_signup_ranked_choices
    @relevant_signup_ranked_choices ||= SignupRankedChoice.where(target_run_id: event.runs.pluck(:id)).to_a
  end

  def apply_bucket_key_mappings
    apply_requested_bucket_mappings_for_signups(all_signups)
    apply_requested_bucket_mappings_for_signup_requests
    apply_requested_bucket_mappings_for_signup_ranked_choices
  end

  def apply_requested_bucket_mappings_for_signups(signups)
    signups.each do |signup|
      to_key = mapped_key_for_removed_bucket(signup.requested_bucket_id)
      next unless to_key

      signup.update_columns(requested_bucket_id: event.registration_policy.bucket_with_key(to_key)&.id)
    end
  end

  def apply_requested_bucket_mappings_for_signup_requests
    relevant_signup_requests.each do |request|
      to_key = mapped_key_for_removed_bucket(request.requested_bucket_id)
      next unless to_key

      request.update_columns(requested_bucket_id: event.registration_policy.bucket_with_key(to_key)&.id)
    end
  end

  def apply_requested_bucket_mappings_for_signup_ranked_choices
    relevant_signup_ranked_choices.each do |choice|
      to_key = mapped_key_for_removed_bucket(choice.requested_bucket_id)
      next unless to_key

      choice.update_columns(requested_bucket_id: event.registration_policy.bucket_with_key(to_key)&.id)
    end
  end

  # The still-persisted buckets (with their real, stable ids) that the incoming new_registration_policy
  # doesn't have a matching key for. Computed once, before update_from! destroys them.
  def removed_buckets
    @removed_buckets ||=
      begin
        new_keys = new_registration_policy.buckets.to_set(&:key)
        event.registration_policy.buckets.reject { |bucket| new_keys.include?(bucket.key) }
      end
  end

  def removed_bucket_ids
    @removed_bucket_ids ||= removed_buckets.map(&:id)
  end

  def mapped_key_for_removed_bucket(bucket_id)
    return nil unless bucket_id && removed_bucket_ids.include?(bucket_id)

    old_bucket = removed_buckets.find { |bucket| bucket.id == bucket_id }
    bucket_key_mappings[old_bucket.key]&.fetch(:to_key, nil)
  end

  def bucket_key_mapping_errors
    unmapped_bucket_key_errors
    invalid_no_preference_mapping_errors
  end

  def unmapped_bucket_key_errors
    unmapped_removed_buckets.each_with_object(errors) do |bucket, errs|
      errs.add(:base, "Bucket key #{bucket.key.inspect} was removed but no mapping was provided")
    end
  end

  # Mapping a removed bucket to "no preference" (to_key: nil) would leave affected
  # signups/requests/ranked choices with a null requested_bucket_id -- fine normally, but the new
  # policy may have prevent_no_preference_signups set, in which case that's not a state new signups
  # are allowed to be created in (see EventSignupService#require_valid_bucket). Reject any such
  # mapping outright rather than silently letting existing records drift into that disallowed state.
  def invalid_no_preference_mapping_errors
    return errors unless new_registration_policy.prevent_no_preference_signups?

    bucket_key_mappings.each_value do |mapping|
      next if mapping[:to_key]

      errors.add(
        :base,
        "Bucket key #{mapping[:from_key].inspect} cannot be mapped to \"no preference\" because the new " \
          "registration policy does not allow no-preference signups"
      )
    end

    errors
  end

  def unmapped_removed_buckets
    run_ids = event.runs.pluck(:id)
    return [] if run_ids.empty? || removed_buckets.empty?

    referenced_removed_bucket_ids =
      (
        Signup.where.not(state: "withdrawn").where(run_id: run_ids).where(requested_bucket_id: removed_bucket_ids) +
          SignupRequest.where(target_run_id: run_ids, state: "pending").where(requested_bucket_id: removed_bucket_ids) +
          SignupRankedChoice.where(target_run_id: run_ids).where(requested_bucket_id: removed_bucket_ids)
      ).map(&:requested_bucket_id).uniq

    removed_buckets.select do |bucket|
      referenced_removed_bucket_ids.include?(bucket.id) && !bucket_key_mappings.key?(bucket.key)
    end
  end

  def check_for_move(signup, new_signup, new_bucket_id)
    return unless new_signup.state != signup.state || new_bucket_id != signup.bucket_id

    move_result =
      SignupMoveResult.new(
        signup.id,
        new_signup.state,
        new_bucket_id,
        signup.state,
        signup.bucket_id,
        bucket_name: bucket_name_for_id(new_bucket_id),
        prev_bucket_name: bucket_name_for_id(signup.bucket_id)
      )
    move_results << move_result
  end

  # bucket_id here may reference a bucket that's already been destroyed by the time this runs (see
  # clear_references_to_removed_buckets and the comment on removed_buckets below), in which case
  # event.registration_policy.bucket_with_id can no longer see it -- fall back to removed_buckets,
  # fetched before the destroy, so the resulting SignupMoveResult can still carry a human-readable
  # name for display (e.g. in move_results_list.liquid).
  def bucket_name_for_id(bucket_id)
    return nil unless bucket_id

    event.registration_policy.bucket_with_id(bucket_id)&.name || removed_buckets_by_id[bucket_id]&.name
  end

  def removed_buckets_by_id
    @removed_buckets_by_id ||= removed_buckets.index_by(&:id)
  end

  def notify_move_results
    move_results.each { |move_result| notify_moved_signup(move_result) if move_result.should_notify? }

    notify_team_members(move_results)
  end

  def notify_moved_signup(result)
    Signups::UserSignupMovedNotifier.new(move_result: result, triggering_user: whodunit).deliver_later
  end

  def notify_team_members(move_results)
    return unless move_results.any?

    Signups::RegistrationPolicyChangeMovedSignupsNotifier.new(
      event: event,
      move_results: move_results,
      whodunit: whodunit
    ).deliver_later
  end

  def all_signups
    @all_signups ||=
      Signup
        .where.not(state: "withdrawn")
        .joins(:run)
        .includes(:user_con_profile, :bucket, :requested_bucket)
        .where(runs: { event_id: event.id })
        .to_a
  end

  def signups_by_run_id
    @signups_by_run_id ||=
      all_signups
        .group_by(&:run_id)
        .transform_values { |signups| signups.sort_by { |signup| [signup.occupying_slot? ? 0 : 1, signup.created_at] } }
  end

  def lock_all_runs(&block)
    event
      .runs
      .inject(block) { |memo, acc| -> { with_advisory_lock_unless_skip_locking("run_#{acc.id}_signups", &memo) } }
      .call
  end
end
