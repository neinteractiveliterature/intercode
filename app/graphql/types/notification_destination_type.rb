# frozen_string_literal: true
class Types::NotificationDestinationType < Types::BaseObject
  field :id,
        Int,
        deprecation_reason:
          "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :source, Types::NotificationSourceType, null: false
  field :user_con_profile, Types::UserConProfileType, null: true, camelize: false
  field :staff_position, Types::StaffPositionType, null: true, camelize: false

  def source
    AssociationLoader.for(NotificationDestination, :source).load(object)
  end

  def user_con_profile
    AssociationLoader.for(NotificationDestination, :user_con_profile).load(object)
  end

  def staff_position
    AssociationLoader.for(NotificationDestination, :staff_position).load(object)
  end
end
