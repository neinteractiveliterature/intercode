class Types::UserActivityAlert < Types::BaseObject
  field :id, Int, null: false
  field :convention, Types::ConventionType, null: false
  field :user, Types::UserType, null: true
  field :partial_name, String, null: true, camelize: false
  field :email, String, null: true
  field :trigger_on_user_con_profile_create, Boolean, null: false, camelize: false
  field :trigger_on_ticket_create, Boolean, null: false, camelize: false
  field :alert_destinations, [Types::AlertDestination], null: false, camelize: false

  def alert_destinations
    AssociationLoader.for(UserActivityAlert, :alert_destinations).load(object)
  end

  def convention
    AssociationLoader.for(UserActivityAlert, :convention).load(object)
  end

  def user
    AssociationLoader.for(UserActivityAlert, :user).load(object)
  end
end
