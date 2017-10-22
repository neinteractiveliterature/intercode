Types::ScheduledValueType = GraphQL::ObjectType.define do
  name "ScheduledValue"

  field :timespans, !types[!Types::TimespanWithValueType]
end
