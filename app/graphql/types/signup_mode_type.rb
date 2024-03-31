# frozen_string_literal: true
class Types::SignupModeType < Types::BaseEnum
  value("self_service", "Attendees can sign themselves up for events")
  value("moderated", "Attendees can request signups and signup changes but con staff must approve them")
end
