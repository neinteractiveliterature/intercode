class Types::ScheduledMoneyValueType < Types::BaseObject

  field :timespans, [Types::TimespanWithMoneyValueType], null: false
end
