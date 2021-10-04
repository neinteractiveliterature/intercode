# frozen_string_literal: true
class Mutations::DeleteTicketType < Mutations::BaseMutation
  graphql_name 'DeleteTicketType'

  field :ticket_type, Types::TicketTypeType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true

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
