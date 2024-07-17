# frozen_string_literal: true
class Mutations::CreateTicketType < Mutations::BaseMutation
  graphql_name "CreateTicketType"

  field :ticket_type, Types::TicketTypeType, null: false

  argument :event_id, ID, required: false
  argument :ticket_type, Types::TicketTypeInputType, required: true, camelize: false

  define_authorization_check do |**args|
    if args[:event_id]
      @event = convention.events.find(args[:event_id])
      TicketTypePolicy.new(pundit_user, @event.ticket_types.new).create?
    else
      TicketTypePolicy.new(pundit_user, convention.ticket_types.new).create?
    end
  end

  def resolve(**args)
    ticket_type =
      if @event
        @event.ticket_types.create!(args[:ticket_type].to_h)
      else
        convention.ticket_types.create!(args[:ticket_type].to_h)
      end

    { ticket_type: }
  end
end
