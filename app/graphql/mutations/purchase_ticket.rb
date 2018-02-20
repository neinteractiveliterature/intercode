Mutations::PurchaseTicket = GraphQL::Relay::Mutation.define do
  name 'PurchaseTicket'
  return_field :ticket, Types::TicketType

  input_field :ticket_type_id, !types.Int
  input_field :stripe_token, !types.String

  resolve ->(_obj, args, ctx) do
    ticket_type = ctx[:convention].ticket_types.find(args[:ticket_type_id])

    result = PurchaseTicketService.new(
      ctx[:user_con_profile],
      ticket_type,
      args[:stripe_token]
    ).call!

    { ticket: result.ticket }
  end
end
