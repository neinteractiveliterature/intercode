class Mutations::UpdateUserActivityAlert < Mutations::BaseMutation
  field :user_activity_alert, Types::UserActivityAlert, null: false, camelize: false

  argument :id, Int, required: true, camelize: false
  argument :user_activity_alert, Types::UserActivityAlertInput, required: true, camelize: false
  argument :add_alert_destinations, [Types::AlertDestinationInput],
    required: true,
    camelize: false
  argument :remove_alert_destination_ids, [Int], required: true, camelize: false

  def resolve(id:, user_activity_alert:, add_alert_destinations:, remove_alert_destination_ids:)
    alert = context[:convention].user_activity_alerts.find(id)
    alert.update!(user_activity_alert.to_h)

    add_alert_destinations.each do |add_alert_destination|
      alert.alert_destinations.create!(add_alert_destination.to_h)
    end

    remove_alert_destination_ids.each do |remove_id|
      alert.alert_destinations.find(remove_id).destroy!
    end

    { user_activity_alert: alert.reload }
  end
end
