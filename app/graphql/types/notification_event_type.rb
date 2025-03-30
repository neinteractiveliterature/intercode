class Types::NotificationEventType < Types::BaseObject
  description <<~MARKDOWN
    A notification event. This is the event that will trigger a notification to be sent out.
  MARKDOWN

  field :allowed_condition_types, [Types::NotificationConditionTypeType], null: false do
    description "The condition types that are allowed for this notification event."
  end
  field :allowed_dynamic_destinations, [Types::NotificationDynamicDestination], null: false do # rubocop:disable GraphQL/ExtractType
    description "The dynamic destinations that are allowed for this notification event."
  end
  field :category, String, null: false, description: "The category of the notification event."
  field :key, Types::NotificationEventKey, null: false do
    description "The key of the notification event."
  end
  field :sends_sms, Boolean, null: false do
    description "Whether this notification event sends SMS notifications."
  end
end
