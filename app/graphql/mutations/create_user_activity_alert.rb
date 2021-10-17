# frozen_string_literal: true
class Mutations::CreateUserActivityAlert < Mutations::BaseMutation
  field :user_activity_alert, Types::UserActivityAlertType, null: false, camelize: false

  argument :user_activity_alert, Types::UserActivityAlertInputType, required: true, camelize: false
  argument :notification_destinations, [Types::NotificationDestinationInputType], required: true, camelize: false

  authorize_create_convention_associated_model :user_activity_alerts

  def resolve(user_activity_alert:, notification_destinations:)
    alert_attrs = process_transitional_ids_in_input(user_activity_alert.to_h, :user_id)
    alert = context[:convention].user_activity_alerts.create!(alert_attrs)

    notification_destinations.each do |notification_destination|
      attrs = process_transitional_ids_in_input(notification_destination.to_h, :user_con_profile_id, :staff_position_id)
      alert.notification_destinations.create!(attrs)
    end

    { user_activity_alert: alert.reload }
  end
end
