# frozen_string_literal: true
class Mutations::UpdateUserActivityAlert < Mutations::BaseMutation
  field :user_activity_alert, Types::UserActivityAlertType, null: false, camelize: false

  argument :id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :user_activity_alert, Types::UserActivityAlertInputType, required: true, camelize: false
  argument :add_notification_destinations, [Types::NotificationDestinationInputType], required: true, camelize: false
  argument :remove_notification_destination_ids,
           [Int],
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_remove_notification_destination_ids, [ID], required: false

  load_and_authorize_convention_associated_model :user_activity_alerts, :id, :update

  def resolve(**args)
    alert_attrs = process_transitional_ids_in_input(user_activity_alert.to_h, :user_id)
    user_activity_alert.update!(alert_attrs)

    args[:add_notification_destinations].each do |add_notification_destination|
      attrs =
        process_transitional_ids_in_input(add_notification_destination.to_h, :user_con_profile_id, :staff_position_id)
      user_activity_alert.notification_destinations.create!(attrs)
    end

    (args[:transitional_remove_notification_destination_ids] || args[:remove_notification_destination_ids])
      .each { |remove_id| user_activity_alert.notification_destinations.find(remove_id).destroy! }

    { user_activity_alert: user_activity_alert.reload }
  end
end
