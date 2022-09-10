class AutoscaleServersService < CivilService::Service
  USERS_PER_INSTANCE = 30
  MIN_INSTANCES = 1
  MIN_INSTANCES_FOR_SIGNUP_OPENING = 2
  MAX_INSTANCES = 8
  SIGNUP_OPENING_LOOKAHEAD_TIME = 1.hour
  SIGNUP_OPENING_DECAY_TIME = 1.hour

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
      (0.5 * Math.log2(user_count)) + (0.5 * (1 / USERS_PER_INSTANCE) * user_count) + MIN_INSTANCES_FOR_SIGNUP_OPENING
    )
  end

  def self.smooth_decay(decay_amount, start, finish)
    smoothed_decay_factor = (Math.cos((decay_amount + 1) * Math::PI) + 1) / 2.0
    max_decay = start - finish
    start - (max_decay * smoothed_decay_factor)
  end

  def self.scaling_target_for(time)
    nearby_increases = Convention.connection.select_rows <<~SQL
      select id, timespans.*
      from conventions,
        jsonb_to_recordset(maximum_event_signups->'timespans') timespans(start timestamp, value text)
      where start between #{Convention.connection.quote time - SIGNUP_OPENING_LOOKAHEAD_TIME}
      and #{Convention.connection.quote time + SIGNUP_OPENING_DECAY_TIME}
      and value not in ('not_now', 'not_yet')
      and signup_mode = 'self_service';
    SQL

    return MIN_INSTANCES if nearby_increases.empty?

    conventions_by_id = Convention.where(id: nearby_increases.map(&:first)).index_by(&:id)
    scaling_targets =
      nearby_increases.map do |convention_id, start_time, _value|
        target = scaling_target_for_signup_opening(conventions_by_id.fetch(convention_id))
        if start_time >= time
          target
        else
          decay_amount = (time - start_time) / SIGNUP_OPENING_DECAY_TIME
          smooth_decay(decay_amount, target, MIN_INSTANCES)
        end
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
  end
end
