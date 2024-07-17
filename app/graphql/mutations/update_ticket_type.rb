# frozen_string_literal: true
class Mutations::UpdateTicketType < Mutations::BaseMutation
  graphql_name "UpdateTicketType"

  field :ticket_type, Types::TicketTypeType, null: false

  argument :id, ID, required: false
  argument :ticket_type, Types::TicketTypeInputType, required: true, camelize: false

  load_and_authorize_model_with_id TicketType, :id, :update

  def resolve(**args)
    ticket_type.update!(args[:ticket_type].to_h)

    { ticket_type: }
  end
end
