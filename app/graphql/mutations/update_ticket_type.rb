# frozen_string_literal: true
class Mutations::UpdateTicketType < Mutations::BaseMutation
  graphql_name 'UpdateTicketType'

  field :ticket_type, Types::TicketTypeType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :ticket_type, Types::TicketTypeInputType, required: true, camelize: false

  load_and_authorize_convention_associated_model :ticket_types, :id, :update

  def resolve(**args)
    ticket_type.update!(args[:ticket_type].to_h)

    { ticket_type: ticket_type }
  end
end
