# frozen_string_literal: true
class Types::NotificationDestinationInputType < Types::BaseInputObject
  description <<~MARKDOWN
    Input type for creating or updating a notification destination.
  MARKDOWN

  argument :conditions, [Types::NotificationConditionInputType], required: false do
    description "The conditions under which the notification will be sent to this destination"
  end
  argument :dynamic_destination, Types::NotificationDynamicDestination, required: false, camelize: true do
    description "The dynamic destination to send the notification to"
  end
  argument :staff_position_id, ID, required: false, camelize: true do
    description "The ID of the staff position to send the notification to"
  end
  argument :user_con_profile_id, ID, required: false, camelize: true do
    description "The ID of the user con profile to send the notification to"
  end
end
