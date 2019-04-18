class Types::TicketInputType < Types::BaseInputObject
  argument :ticket_type_id, Int, required: true, camelize: false
  argument :payment_amount, Types::MoneyInputType, required: false, camelize: false
  argument :payment_note, String, required: false, camelize: false
  argument :provided_by_event_id, Int, required: false, camelize: false
end
