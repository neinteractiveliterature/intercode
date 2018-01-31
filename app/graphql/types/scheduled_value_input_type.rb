Types::ScheduledValueInputType = GraphQL::InputObjectType.define do
  name 'ScheduledValueInput'

  input_field :timespans, !types[!Types::TimespanWithValueInputType]
end
