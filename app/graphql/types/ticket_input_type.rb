# frozen_string_literal: true
class Types::TicketInputType < Types::BaseInputObject
  argument :ticket_type_id, ID, required: false, camelize: true
  argument :provided_by_event_id, ID, required: false, camelize: true
end
