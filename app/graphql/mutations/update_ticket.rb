# frozen_string_literal: true
class Mutations::UpdateTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :ticket, Types::TicketInputType, required: true

  load_and_authorize_convention_associated_model :tickets, :id, :update

  def resolve(**args)
    ticket_attrs = args[:ticket].to_h
    ticket.update!(ticket_attrs)

    { ticket: ticket }
  end
end
