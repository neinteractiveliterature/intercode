class Mutations::UpdateUserActivityAlert < Mutations::BaseMutation
  field :user_activity_alert, Types::UserActivityAlert, null: false, camelize: false

  argument :id, Int, required: true, camelize: false
  argument :user_activity_alert, Types::UserActivityAlertInput, required: true, camelize: false
  argument :add_alert_destinations, [Types::AlertDestinationInput],
    required: true,
    camelize: false
  argument :remove_alert_destination_ids, [Int], required: true, camelize: false

  load_and_authorize_convention_associated_model :user_activity_alerts, :id, :update

  def resolve(**args)
    user_activity_alert.update!(args[:user_activity_alert].to_h)

    args[:add_alert_destinations].each do |add_alert_destination|
      user_activity_alert.alert_destinations.create!(add_alert_destination.to_h)
    end

    args[:remove_alert_destination_ids].each do |remove_id|
      user_activity_alert.alert_destinations.find(remove_id).destroy!
    end

    { user_activity_alert: user_activity_alert.reload }
  end
end
