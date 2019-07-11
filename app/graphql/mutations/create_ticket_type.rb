class Mutations::CreateTicketType < Mutations::BaseMutation
  graphql_name 'CreateTicketType'

  field :ticket_type, Types::TicketTypeType, null: false

  argument :ticket_type, Types::TicketTypeInputType, required: true, camelize: false

  authorize_create_convention_associated_model :ticket_types

  def resolve(**args)
    ticket_type = convention.ticket_types.create!(args[:ticket_type].to_h)

    { ticket_type: ticket_type }
  end
end
