# frozen_string_literal: true
class Mutations::DeleteTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :refund, Boolean, required: false

  load_and_authorize_convention_associated_model :tickets, :id, :destroy

  def resolve(**args)
    ticket = convention.tickets.find(args[:id])
    DeleteTicketService.new(ticket: ticket, refund: args[:refund], whodunit: user_con_profile).call!

    { ticket: ticket }
  end
end
