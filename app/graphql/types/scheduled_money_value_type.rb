Types::ScheduledMoneyValueType = GraphQL::ObjectType.define do
  name 'ScheduledMoneyValue'

  field :timespans, !types[!Types::TimespanWithMoneyValueType]
end
