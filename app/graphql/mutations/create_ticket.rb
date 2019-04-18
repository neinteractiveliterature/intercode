class Mutations::CreateTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :user_con_profile_id, Int, required: true, camelize: false
  argument :ticket, Types::TicketInputType, required: true

  def resolve(user_con_profile_id:, ticket:)
    ticket_profile = convention.user_con_profiles.find(user_con_profile_id)
    ticket_attrs = ticket.to_h
    ticket_attrs[:payment_amount] = MoneyHelper.coerce_money_input(ticket_attrs[:payment_amount])
    ticket_model = ticket_profile.create_ticket!(ticket_attrs)

    { ticket: ticket_model }
  end
end
