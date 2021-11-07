# frozen_string_literal: true
class Types::TicketInputType < Types::BaseInputObject
  argument :transitional_ticket_type_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the ticketTypeId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :ticket_type_id, ID, required: false, camelize: true
  argument :transitional_provided_by_event_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the providedByEventId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :provided_by_event_id, ID, required: false, camelize: true
end
