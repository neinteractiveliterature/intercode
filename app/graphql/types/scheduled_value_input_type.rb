# frozen_string_literal: true
class Types::ScheduledValueInputType < Types::BaseInputObject
  argument :timespans, [Types::TimespanWithValueInputType], required: true
end
