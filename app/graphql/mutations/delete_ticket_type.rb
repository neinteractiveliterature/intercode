Mutations::DeleteTicketType = GraphQL::Relay::Mutation.define do
  name 'DeleteTicketType'
  return_field :ticket_type, Types::TicketTypeType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    ticket_type = ctx[:convention].ticket_types.find(args[:id])
    if ticket_type.tickets.any?
      return GraphQL::ExecutionError.new("#{ticket_type.description} can't be deleted because \
#{ctx[:convention].ticket_name.pluralize} have already been purchased using this \
#{ctx[:convention].ticket_name} type.")
    end

    ticket_type.destroy!

    { ticket_type: ticket_type }
  }
end
