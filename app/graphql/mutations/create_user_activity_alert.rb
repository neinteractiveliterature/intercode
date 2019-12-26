class Mutations::CreateUserActivityAlert < Mutations::BaseMutation
  field :user_activity_alert, Types::UserActivityAlertType, null: false, camelize: false

  argument :user_activity_alert, Types::UserActivityAlertInputType, required: true, camelize: false
  argument :notification_destinations, [Types::NotificationDestinationInputType],
    required: true,
    camelize: false

  authorize_create_convention_associated_model :user_activity_alerts

  def resolve(user_activity_alert:, notification_destinations:)
    alert = context[:convention].user_activity_alerts.create!(user_activity_alert.to_h)

    notification_destinations.each do |notification_destination|
      alert.notification_destination.create!(notification_destination.to_h)
    end

    { user_activity_alert: alert.reload }
  end
end
