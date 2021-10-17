# frozen_string_literal: true
class Types::ScheduledValueType < Types::BaseObject
  field :timespans, [Types::TimespanWithValueType], null: false
end
