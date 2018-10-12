class Types::AlertDestination < Types::BaseObject
  field :id, Int, null: false
  field :alert, Types::Alert, null: false
  field :user_con_profile, Types::UserConProfileType, null: true, camelize: false
  field :staff_position, Types::StaffPositionType, null: true, camelize: false

  def alert
    AssociationLoader.for(AlertDestination, :alert).load(object)
  end

  def user_con_profile
    AssociationLoader.for(AlertDestination, :user_con_profile).load(object)
  end

  def staff_position
    AssociationLoader.for(AlertDestination, :staff_position).load(object)
  end
end
