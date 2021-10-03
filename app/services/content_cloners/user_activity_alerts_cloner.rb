# frozen_string_literal: true
class ContentCloners::UserActivityAlertsCloner < ContentCloners::ContentClonerBase
  def clone(convention)
    @id_maps[:notification_destinations] = {}
    @id_maps[:user_activity_alerts] =
      clone_with_id_map(
        source_convention.user_activity_alerts,
        convention.user_activity_alerts
      ) do |user_activity_alert, cloned_user_activity_alert|
        cloned_user_activity_alert.save!

        destination_id_map =
          clone_with_id_map(
            user_activity_alert.notification_destinations.where.not(staff_position_id: nil),
            cloned_user_activity_alert.notification_destinations
          ) do |notification_destination, cloned_notification_destination|
            cloned_notification_destination.staff_position =
              (@id_maps[:staff_positions][notification_destination.staff_position_id])
            cloned_notification_destination.user_con_profile = nil
          end
        @id_maps[:notification_destinations].merge!(destination_id_map)
      end
  end
end
