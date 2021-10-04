# frozen_string_literal: true
class Types::TicketInputType < Types::BaseInputObject
  argument :ticket_type_id,
           Int,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_ticket_type_id, ID, required: false, camelize: true
  argument :provided_by_event_id,
           Int,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_provided_by_event_id, ID, required: false, camelize: true
end
