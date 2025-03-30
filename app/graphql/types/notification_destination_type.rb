# frozen_string_literal: true
class Types::NotificationDestinationType < Types::BaseObject
  description <<~MARKDOWN
    A destination that notifications will be sent to. This can be a user, a staff position, or a dynamic destination.
    Only one of these can be present.
  MARKDOWN

  field :conditions, [Types::NotificationConditionType], null: true do
    description "Conditions that must be met for this destination to be used"
  end
  field :dynamic_destination, Types::NotificationDynamicDestination, null: true, camelize: false do
    description "A dynamic destination that will be used to determine the actual destination"
  end
  field :id, ID, null: false, description: "The ID of the notification destination"
  field :source, Types::NotificationSourceType, null: false, description: "The object that will send the notification"
  field :staff_position, Types::StaffPositionType, null: true, camelize: false do
    description "The staff position that will receive the notification"
  end
  field :user_con_profile, Types::UserConProfileType, null: true, camelize: false do
    description "The user profile that will receive the notification"
  end

  def source
    dataloader.with(Sources::ActiveRecordAssociation, NotificationDestination, :source).load(object)
  end

  def user_con_profile
    dataloader.with(Sources::ActiveRecordAssociation, NotificationDestination, :user_con_profile).load(object)
  end

  def staff_position
    dataloader.with(Sources::ActiveRecordAssociation, NotificationDestination, :staff_position).load(object)
  end

  def conditions
    return unless object.conditions
    object.conditions.map { |condition_type, value| { condition_type:, value: } }
  end
end
