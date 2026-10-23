# frozen_string_literal: true
# To simulate the effect of autoscaling as a CSV file:
# bin/rails runner script/generate_simulated_autoscaling_graph.rb

class AutoscaleServersService < CivilService::Service
  USERS_PER_INSTANCE = ENV.fetch("AUTOSCALE_USERS_PER_INSTANCE", "40").to_i
  ADVISORY_LOCK_NAME = "autoscale_servers"
  MIN_INSTANCES = ENV.fetch("AUTOSCALE_MIN_INSTANCES", "2").to_i
  MIN_INSTANCES_FOR_SIGNUP_OPENING = ENV.fetch("AUTOSCALE_MIN_INSTANCES_FOR_SIGNUP_OPENING", "2").to_i
  MAX_INSTANCES = ENV.fetch("AUTOSCALE_MAX_INSTANCES", "10").to_i
  # If a web machine is projected to run out of CPU burst balance within this long, add a performance machine
  CPU_BALANCE_HORIZON = ENV.fetch("AUTOSCALE_CPU_BALANCE_HORIZON_MINUTES", "45").to_i.minutes
  # Once added, keep the performance machine at least this long, so that the relief it gives the others doesn't make it
  # flap on and off
  CPU_BALANCE_MIN_LARGE_LIFETIME = ENV.fetch("AUTOSCALE_CPU_BALANCE_MIN_LARGE_LIFETIME_HOURS", "2").to_i.hours
  SIGNUP_OPENING_LOOKAHEAD_TIME = ENV.fetch("AUTOSCALE_SIGNUP_OPENING_LOOKAHEAD_HOURS", "48").to_i.hours
  SIGNUP_OPENING_RAMP_UP_LOOKAHEAD_TIME = ENV.fetch("AUTOSCALE_SIGNUP_OPENING_RAMP_UP_LOOKAHEAD_HOURS", "2").to_i.hours
  SIGNUP_OPENING_FULL_THROTTLE_LOOKAHEAD_TIME =
    ENV.fetch("AUTOSCALE_SIGNUP_OPENING_FULL_THROTTLE_LOOKAHEAD_HOURS", "1").to_i.hours
  SIGNUP_OPENING_DECAY_TIME = ENV.fetch("AUTOSCALE_SIGNUP_OPENING_DECAY_TIME", "6").to_i.hours
  SIGNUP_OPENING_LOOKBACK_TIME = ENV.fetch("AUTOSCALE_SIGNUP_OPENING_LOOKBACK_TIME", "6").to_i.hours

  def self.scaling_target_for_signup_opening(convention)
    user_count =
      if convention.ticket_mode == "required_for_signup"
        convention.user_con_profiles.joins(:ticket).count
      else
        convention.user_con_profiles.count
      end

    # (log2(0) is -Infinity, which would turn into NaN in the throttling and blow up the clamp, so a convention with
    # nobody in it yet just doesn't get the log term)
    log_term = user_count.positive? ? Math.log2(user_count) : 0

    (
      # log2 term: bias the low end of the formula to use more servers, because redundancy = good
      # linear term: the log2 term accounts for ~half of the needed servers
      # constant term: never go below a certain minimum for a signup opening
      (0.5 * log_term) + (0.5 * (1 / USERS_PER_INSTANCE.to_f) * user_count) + MIN_INSTANCES_FOR_SIGNUP_OPENING
    )
  end

  def self.smooth_decay(decay_amount, start, finish)
    smoothed_decay_factor = (Math.cos((decay_amount + 1) * Math::PI) + 1) / 2.0
    max_decay = start - finish
    start - (max_decay * smoothed_decay_factor)
  end

  def self.apply_throttle_for_target(target, start_time, time)
    if start_time >= time
      if time >= start_time - SIGNUP_OPENING_FULL_THROTTLE_LOOKAHEAD_TIME
        # we're in the full-blast signup prep phase, scale up all the way
        target
      elsif time >= start_time - SIGNUP_OPENING_RAMP_UP_LOOKAHEAD_TIME
        # we're ramping up to signups, scale up slowly
        ramp_up_duration = SIGNUP_OPENING_RAMP_UP_LOOKAHEAD_TIME - SIGNUP_OPENING_FULL_THROTTLE_LOOKAHEAD_TIME
        decay_amount = (((start_time - ramp_up_duration) - time) / ramp_up_duration)
        smooth_decay(decay_amount, target, MIN_INSTANCES_FOR_SIGNUP_OPENING)
      else
        # we're in the pre-signup phase, always have redundant instances ready
        MIN_INSTANCES_FOR_SIGNUP_OPENING
      end
    elsif time >= start_time + SIGNUP_OPENING_DECAY_TIME
      MIN_INSTANCES_FOR_SIGNUP_OPENING
    else
      decay_amount = (time - start_time) / SIGNUP_OPENING_DECAY_TIME
      smooth_decay(decay_amount, target, MIN_INSTANCES_FOR_SIGNUP_OPENING)
    end
  end

  def self.scaling_target_for(time)
    nearby_increases = Convention.connection.select_rows <<~SQL.squish
      select conventions.id, signup_rounds.start, signup_rounds.maximum_event_signups
      from conventions
      join signup_rounds on signup_rounds.convention_id = conventions.id
      where start between #{Convention.connection.quote time - SIGNUP_OPENING_LOOKBACK_TIME}
      and #{Convention.connection.quote time + SIGNUP_OPENING_LOOKAHEAD_TIME}
      and maximum_event_signups not in ('not_now', 'not_yet')
      and signup_mode = 'self_service';
    SQL

    return MIN_INSTANCES if nearby_increases.empty?

    conventions_by_id = Convention.where(id: nearby_increases.map(&:first)).index_by(&:id)
    scaling_targets =
      nearby_increases.map do |convention_id, start_time, _value|
        target = scaling_target_for_signup_opening(conventions_by_id.fetch(convention_id))
        apply_throttle_for_target(target, start_time, time)
      end

    scaling_targets.max.clamp(MIN_INSTANCES, MAX_INSTANCES).ceil
  end

  def self.worker_scaling_target_for(time)
    web_scaling_target = scaling_target_for(time)

    if web_scaling_target == MIN_INSTANCES
      1
    else
      2
    end
  end

  def self.worker_instance_type_for(time)
    web_scaling_target = scaling_target_for(time)

    if web_scaling_target == MIN_INSTANCES
      :small
    else
      :large
    end
  end

  # Returns how many performance-1x web machines (which have no burst balance to run out of) should run alongside the
  # regular ones. runway is the time until the soonest regular web machine runs out of CPU burst balance, or nil if none
  # is draining or it's unknown. It has to get comfortably past the horizon before an existing machine is released.
  def self.large_web_target_for(runway:, large_instances:, now:)
    return 1 if runway && runway < CPU_BALANCE_HORIZON
    return 0 if large_instances.empty?

    keep_large_web?(runway:, large_instances:, now:) ? 1 : 0
  end

  def self.keep_large_web?(runway:, large_instances:, now:)
    return true if runway && runway < CPU_BALANCE_HORIZON * 2

    large_instances.any? do |instance|
      instance.created_at.nil? || now - instance.created_at < CPU_BALANCE_MIN_LARGE_LIFETIME
    end
  end

  private

  # Skip rather than wait if another run is in progress: this task can be delivered to more than one worker (and SQS
  # delivers at least once), and the next scheduled run re-evaluates from scratch anyway
  def inner_call
    lock_result =
      ActiveRecord::Base.with_advisory_lock_result(ADVISORY_LOCK_NAME, timeout_seconds: 0) { apply_scaling_targets }

    Rails.logger.info "Another autoscale run is in progress, skipping this one" unless lock_result.lock_was_acquired?
    success
  end

  def apply_scaling_targets
    now = Time.current
    web_scaling_target = self.class.scaling_target_for(now)
    worker_scaling_target = self.class.worker_scaling_target_for(now)
    worker_instance_type = self.class.worker_instance_type_for(now)

    targets = [
      { group: :web, type: web_scaling_target == MIN_INSTANCES ? :small : :medium, count: web_scaling_target },
      { group: :worker, type: worker_instance_type, count: worker_scaling_target }
    ]

    large_web_target =
      self.class.large_web_target_for(
        runway: adapter.seconds_until_cpu_exhaustion(group: :web),
        large_instances: adapter.instances_state.find_instances(group: :web, type: :large),
        now:
      )
    targets << { group: :web, type: :large, count: large_web_target } if large_web_target.positive?

    adapter.apply_instance_counts(targets)
  end

  def adapter
    @adapter ||= HostingServiceAdapters.find_adapter
  end
end
