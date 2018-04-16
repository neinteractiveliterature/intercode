class Types::ScheduledValueType < Types::BaseObject

  field :timespans, [Types::TimespanWithValueType], null: false
end
