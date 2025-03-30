class Types::NotificationConditionType < Types::BaseObject
  description "A condition that must be met for a notification to be sent to a destination."

  field :condition_type, Types::NotificationConditionTypeType, null: false, camelize: false do
    description "The type of condition."
  end
  field :value, Types::JSON, null: true do
    description "The value of the condition.  This will vary depending on the condition type."
  end
end
