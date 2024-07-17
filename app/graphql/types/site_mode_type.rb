# frozen_string_literal: true
class Types::SiteModeType < Types::BaseEnum
  value("convention", "Site behaves as a convention with multiple events")
  value("single_event", "Site behaves as a single standalone event")
  value("event_series", "Site behaves as a series of standalone events")
end
