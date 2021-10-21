# frozen_string_literal: true
class Mutations::DeleteTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :refund, Boolean, required: false

  load_and_authorize_convention_associated_model :tickets, :id, :destroy

  def resolve(**args)
    DeleteTicketService.new(ticket: ticket, refund: args[:refund], whodunit: user_con_profile).call!

    { ticket: ticket }
  end
end
