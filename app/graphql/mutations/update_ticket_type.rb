class Mutations::UpdateTicketType < Mutations::BaseMutation
  graphql_name 'UpdateTicketType'

  field :ticket_type, Types::TicketTypeType, null: false

  argument :id, Integer, required: true
  argument :ticket_type, Types::TicketTypeInputType, required: true, camelize: false

  load_and_authorize_convention_associated_model :ticket_types, :id, :update

  def resolve(**args)
    ticket_type.update!(args[:ticket_type].to_h)

    { ticket_type: ticket_type }
  end
end
