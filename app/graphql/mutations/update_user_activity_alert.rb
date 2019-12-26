class Mutations::UpdateUserActivityAlert < Mutations::BaseMutation
  field :user_activity_alert, Types::UserActivityAlertType, null: false, camelize: false

  argument :id, Int, required: true, camelize: false
  argument :user_activity_alert, Types::UserActivityAlertInputType, required: true, camelize: false
  argument :add_notification_destinations, [Types::NotificationDestinationInputType],
    required: true,
    camelize: false
  argument :remove_notification_destination_ids, [Int], required: true, camelize: false

  load_and_authorize_convention_associated_model :user_activity_alerts, :id, :update

  def resolve(**args)
    user_activity_alert.update!(args[:user_activity_alert].to_h)

    args[:add_notification_destinations].each do |add_notification_destination|
      user_activity_alert.notification_destinations.create!(add_notification_destination.to_h)
    end

    args[:remove_notification_destination_ids].each do |remove_id|
      user_activity_alert.notification_destinations.find(remove_id).destroy!
    end

    { user_activity_alert: user_activity_alert.reload }
  end
end
