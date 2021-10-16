# frozen_string_literal: true
class Types::ScheduledMoneyValueInputType < Types::BaseInputObject
  argument :timespans, [Types::TimespanWithMoneyValueInputType], required: true
end
