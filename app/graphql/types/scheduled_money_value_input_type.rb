Types::ScheduledMoneyValueInputType = GraphQL::InputObjectType.define do
  name 'ScheduledMoneyValueInput'

  input_field :timespans, !types[!Types::TimespanWithMoneyValueInputType]
end
