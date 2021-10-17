# frozen_string_literal: true
class Types::ScheduledMoneyValueType < Types::BaseObject
  field :timespans, [Types::TimespanWithMoneyValueType], null: false
end
