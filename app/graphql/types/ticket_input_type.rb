class Types::TicketInputType < Types::BaseInputObject
  argument :ticket_type_id, Int, required: true, camelize: false
  argument :provided_by_event_id, Int, required: false, camelize: false
end
