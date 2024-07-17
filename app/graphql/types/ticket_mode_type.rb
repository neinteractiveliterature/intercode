# frozen_string_literal: true
class Types::TicketModeType < Types::BaseEnum
  value("disabled", "Tickets are neither sold nor required in this convention")
  value("required_for_signup", "A valid ticket is required to sign up for events in this convention")
  value("ticket_per_event", "Each event in this convention sells tickets separately")
end
