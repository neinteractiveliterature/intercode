# Script to generate graph:
# require "csv"
# Time.zone = "America/New_York"
# time = Time.local(2022, 10, 31)
# data = []
# while time < Time.local(2022, 11, 4)
#   data << [time, AutoscaleServersService.scaling_target_for(time)]
#   time += 15.minutes
# end
# CSV.open("scaling-graph.csv", "w") do |csv|
#   csv << %w[Time Servers]
#   data.each { |row| csv << row }
# end

class AutoscaleServersService < CivilService::Service
  USERS_PER_INSTANCE = ENV.fetch("AUTOSCALE_USERS_PER_INSTANCE", "40").to_i
  MIN_INSTANCES = ENV.fetch("AUTOSCALE_MIN_INSTANCES", "1").to_i
  MIN_INSTANCES_FOR_SIGNUP_OPENING = ENV.fetch("AUTOSCALE_MIN_INSTANCES_FOR_SIGNUP_OPENING", "2").to_i
  MAX_INSTANCES = ENV.fetch("AUTOSCALE_MAX_INSTANCES", "8").to_i
  SIGNUP_OPENING_LOOKAHEAD_TIME = ENV.fetch("AUTOSCALE_SIGNUP_OPENING_LOOKAHEAD_HOURS", "48").to_i.hours
  SIGNUP_OPENING_RAMP_UP_LOOKAHEAD_TIME = ENV.fetch("AUTOSCALE_SIGNUP_OPENING_RAMP_UP_LOOKAHEAD_HOURS", "2").to_i.hours
  SIGNUP_OPENING_FULL_THROTTLE_LOOKAHEAD_TIME =
    ENV.fetch("AUTOSCALE_SIGNUP_OPENING_FULL_THROTTLE_LOOKAHEAD_HOURS", "1").to_i.hours
  SIGNUP_OPENING_DECAY_TIME = ENV.fetch("AUTOSCALE_SIGNUP_OPENING_DECAY_TIME", "1").to_i.hours
  SIGNUP_OPENING_LOOKBACK_TIME = ENV.fetch("AUTOSCALE_SIGNUP_OPENING_LOOKBACK_TIME", "6").to_i.hours

  def self.scaling_target_for_signup_opening(convention)
    user_count =
      if convention.ticket_mode == "required_for_signup"
        convention.user_con_profiles.joins(:ticket).count
      else
        convention.user_con_profiles.count
      end

    (
      # log2 term: bias the low end of the formula to use more servers, because redundancy = good
      # linear term: the log2 term accounts for ~half of the needed servers
      # constant term: never go below a certain minimum for a signup opening
      (0.5 * Math.log2(user_count)) + (0.5 * (1 / USERS_PER_INSTANCE.to_f) * user_count) +
        MIN_INSTANCES_FOR_SIGNUP_OPENING
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
    else
      if time >= start_time + SIGNUP_OPENING_DECAY_TIME
        MIN_INSTANCES_FOR_SIGNUP_OPENING
      else
        decay_amount = (time - start_time) / SIGNUP_OPENING_DECAY_TIME
        smooth_decay(decay_amount, target, MIN_INSTANCES_FOR_SIGNUP_OPENING)
      end
    end
  end

  def self.scaling_target_for(time)
    nearby_increases = Convention.connection.select_rows <<~SQL
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

    [[MIN_INSTANCES, *scaling_targets].max, MAX_INSTANCES].min.ceil
  end

  private

  def inner_call
    adapter = HostingServiceAdapters::Base.find_adapter
    return unless adapter

    scaling_target = self.class.scaling_target_for(Time.now)
    current_instance_count = adapter.fetch_instance_count

    if current_instance_count == scaling_target
      Rails.logger.info "Currently running #{current_instance_count} #{"instance".pluralize(current_instance_count)}; \
no autoscaling needed"
    else
      Rails.logger.info "Autoscaling to #{scaling_target} instances"
      adapter.update_instance_count(scaling_target)
    end

    success
  end
end
