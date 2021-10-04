# frozen_string_literal: true
class Mutations::UpdateTicketType < Mutations::BaseMutation
  graphql_name 'UpdateTicketType'

  field :ticket_type, Types::TicketTypeType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :ticket_type, Types::TicketTypeInputType, required: true, camelize: false

  load_and_authorize_convention_associated_model :ticket_types, :id, :update

  def resolve(**args)
    ticket_type.update!(args[:ticket_type].to_h)

    { ticket_type: ticket_type }
  end
end
