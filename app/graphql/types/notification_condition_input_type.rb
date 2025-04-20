# frozen_string_literal: true

module Types
  class NotificationConditionInputType < Types::BaseInputObject
    description <<~MARKDOWN
      An input type for creating or updating conditions that must be met for a notification to be sent to a destination.
    MARKDOWN

    argument :condition_type, Types::NotificationConditionTypeType, required: true, camelize: true do
      description "The type of condition."
    end
    argument :value, Types::JSON, required: false do
      description "The value of the condition.  This will vary depending on the condition type."
    end
  end
end
