Mutations::CreateTicketType = GraphQL::Relay::Mutation.define do
  name 'CreateTicketType'
  return_field :ticket_type, Types::TicketTypeType

  input_field :ticket_type, !Types::TicketTypeInputType

  resolve ->(_obj, args, ctx) {
    ticket_type = ctx[:convention].ticket_types.create!(args[:ticket_type].to_h)

    { ticket_type: ticket_type }
  }
end
