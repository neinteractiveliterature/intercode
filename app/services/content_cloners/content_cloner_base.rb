# frozen_string_literal: true
class ContentCloners::ContentClonerBase
  attr_reader :source_convention, :id_maps

  def initialize(source_convention, id_maps)
    @source_convention = source_convention
    @id_maps = id_maps.dup
  end

  def clone(_convention)
    raise NotImplementedError, "Subclasses must implement #clone"
  end

  private

  def clone_with_id_map(source_scope, destination_scope, &block)
    id_map = {}
    source_scope.find_each do |model|
      cloned_model =
        destination_scope.new(model.attributes.symbolize_keys.except(:id, :created_at, :updated_at, :image))
      block&.call(model, cloned_model)
      cloned_model.save!
      id_map[model.id] = cloned_model
    end
    id_map
  end

  def shift_scheduled_value(value, amount)
    return nil unless value

    value.class.new(
      **value.attributes.symbolize_keys,
      timespans:
        value.timespans.map do |timespan|
          {
            start: timespan.start ? timespan.start + amount : nil,
            finish: timespan.finish ? timespan.finish + amount : nil,
            value: timespan.value
          }
        end
    )
  end

  def shift_scheduled_value_by_convention_distance(convention, value)
    shift_scheduled_value(value, convention.starts_at - source_convention.starts_at)
  end

  def clone_user_con_profile(user_con_profile)
    @id_maps[:user_con_profiles] ||= {}
    cloned_user_con_profile = @id_maps.fetch[:user_con_profiles][user_con_profile.id]
    return cloned_user_con_profile if cloned_user_con_profile

    cloned_user_con_profile =
      SetupUserConProfileService
        .new(convention: cloned_source.convention, user: @id_maps.fetch(:users)[user_con_profile.user_id])
        .call!
        .user_con_profile
    @id_maps[:user_con_profiles][user_con_profile.id] = cloned_user_con_profile
    cloned_user_con_profile
  end

  def clone_notification_destinations(source, cloned_source)
    clone_with_id_map(
      source.notification_destinations,
      cloned_source.notification_destinations
    ) do |notification_destination, cloned_notification_destination|
      if notification_destination.user_con_profile_id
        cloned_notification_destination.user_con_profile =
          clone_user_con_profile(notification_destination.user_con_profile)
      end

      cloned_notification_destination.staff_position =
        @id_maps.fetch(:staff_positions)[notification_destination.staff_position_id]
      cloned_notification_destination.conditions =
        notification_destination.conditions.to_h do |condition_key, condition_value|
          case condition_key.to_sym
          when :event_category
            [:event_category, @id_maps.fetch(:event_categories)[condition_value]]
          else
            [condition_key, condition_value]
          end
        end
    end
  end
end
