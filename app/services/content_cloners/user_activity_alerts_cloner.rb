# frozen_string_literal: true
class ContentCloners::UserActivityAlertsCloner < ContentCloners::ContentClonerBase
  def clone(convention)
    @id_maps[:notification_destinations] = {}
    @id_maps[:user_activity_alerts] = clone_with_id_map(
      source_convention.user_activity_alerts,
      convention.user_activity_alerts
    ) do |user_activity_alert, cloned_user_activity_alert|
      cloned_user_activity_alert.save!

      destination_id_map = clone_notification_destinations(user_activity_alert, cloned_user_activity_alert)
      @id_maps[:notification_destinations].merge!(destination_id_map)
    end
  end
end
