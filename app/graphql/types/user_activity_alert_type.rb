# frozen_string_literal: true
class Types::UserActivityAlertType < Types::BaseObject
  description "A rule that notifies people about activity matching certain criteria"
  authorize_record

  field :convention,
        Types::ConventionType,
        association_model: UserActivityAlert,
        null: false,
        description: "The convention this alert applies to"
  field :email, String, null: true, description: "The email address to watch for"
  field :id, ID, null: false, description: "The ID of this user activity alert"
  field :notification_destinations,
        [Types::NotificationDestinationType],
        association_model: UserActivityAlert,
        null: false,
        camelize: false,
        description: "Who gets notified"
  field :partial_name, String, null: true, camelize: false, description: "Part of a name to watch for"
  field :trigger_on_ticket_create,
        Boolean,
        null: false,
        camelize: false,
        description: "Whether to alert when a matching person gets a ticket"
  # rubocop:disable-next GraphQL/ExtractType
  field :trigger_on_user_con_profile_create,
        Boolean,
        null: false,
        camelize: false,
        description: "Whether to alert when a matching person creates a profile"
  field :user, Types::UserType, association_model: UserActivityAlert, null: true, description: "The user to watch for"
end
