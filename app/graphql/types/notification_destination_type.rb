class Types::NotificationDestinationType < Types::BaseObject
  field :id, Int, null: false
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
