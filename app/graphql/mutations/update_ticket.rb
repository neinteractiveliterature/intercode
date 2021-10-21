# frozen_string_literal: true
class Mutations::UpdateTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :ticket, Types::TicketInputType, required: true

  load_and_authorize_convention_associated_model :tickets, :id, :update

  def resolve(**args)
    attrs = process_transitional_ids_in_input(args[:ticket].to_h, :ticket_type_id, :provided_by_event_id)
    ticket.update!(attrs)

    { ticket: ticket }
  end
end
