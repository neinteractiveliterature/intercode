# frozen_string_literal: true
class Types::NotificationDestinationType < Types::BaseObject
  field :id, ID, null: false
  field :source, Types::NotificationSourceType, null: false
  field :staff_position, Types::StaffPositionType, null: true, camelize: false
  field :user_con_profile, Types::UserConProfileType, null: true, camelize: false

  def source
    dataloader.with(Sources::ActiveRecordAssociation, NotificationDestination, :source).load(object)
  end

  def user_con_profile
    dataloader.with(Sources::ActiveRecordAssociation, NotificationDestination, :user_con_profile).load(object)
  end

  def staff_position
    dataloader.with(Sources::ActiveRecordAssociation, NotificationDestination, :staff_position).load(object)
  end
end
