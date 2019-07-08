class Mutations::CreateUserActivityAlert < Mutations::BaseMutation
  field :user_activity_alert, Types::UserActivityAlert, null: false, camelize: false

  argument :user_activity_alert, Types::UserActivityAlertInput, required: true, camelize: false
  argument :alert_destinations, [Types::AlertDestinationInput],
    required: true,
    camelize: false

  authorize_create_convention_associated_model :user_activity_alerts

  def resolve(user_activity_alert:, alert_destinations:)
    alert = context[:convention].user_activity_alerts.create!(user_activity_alert.to_h)

    alert_destinations.each do |alert_destination|
      alert.alert_destinations.create!(alert_destination.to_h)
    end

    { user_activity_alert: alert.reload }
  end
end
