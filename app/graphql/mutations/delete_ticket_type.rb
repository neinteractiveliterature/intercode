# frozen_string_literal: true
class Mutations::DeleteTicketType < Mutations::BaseMutation
  graphql_name 'DeleteTicketType'

  field :ticket_type, Types::TicketTypeType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :ticket_types, :id, :destroy

  def resolve(**_args)
    if ticket_type.tickets.any?
      return(
        GraphQL::ExecutionError.new(
          "#{ticket_type.description} can't be deleted because \
#{convention.ticket_name.pluralize} have already been purchased using this \
#{convention.ticket_name} type."
        )
      )
    end

    ticket_type.destroy!

    { ticket_type: ticket_type }
  end
end
