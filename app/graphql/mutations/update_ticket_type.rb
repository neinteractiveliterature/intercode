class Mutations::UpdateTicketType < Mutations::BaseMutation
  graphql_name 'UpdateTicketType'

  field :ticket_type, Types::TicketTypeType, null: false

  argument :id, Integer, required: true
  argument :ticket_type, Types::TicketTypeInputType, required: true, camelize: false

  def resolve(**args)
    ticket_type = convention.ticket_types.find(args[:id])
    ticket_type.update!(args[:ticket_type].to_h)

    { ticket_type: ticket_type }
  end
end
