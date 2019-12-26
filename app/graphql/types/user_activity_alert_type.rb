class Types::UserActivityAlertType < Types::BaseObject
  authorize_record

  field :id, Int, null: false
  field :convention, Types::ConventionType, null: false
  field :user, Types::UserType, null: true
  field :partial_name, String, null: true, camelize: false
  field :email, String, null: true
  field :trigger_on_user_con_profile_create, Boolean, null: false, camelize: false
  field :trigger_on_ticket_create, Boolean, null: false, camelize: false
  field :notification_destinations, [Types::NotificationDestinationType],
    null: false, camelize: false

  association_loaders UserActivityAlert, :notification_destinations, :convention, :user
end
