class Mutations::DeleteTicketType < Mutations::BaseMutation
  graphql_name 'DeleteTicketType'

  field :ticket_type, Types::TicketTypeType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    ticket_type = convention.ticket_types.find(args[:id])
    if ticket_type.tickets.any?
      return GraphQL::ExecutionError.new("#{ticket_type.description} can't be deleted because \
#{convention.ticket_name.pluralize} have already been purchased using this \
#{convention.ticket_name} type.")
    end

    ticket_type.destroy!

    { ticket_type: ticket_type }
  end
end
