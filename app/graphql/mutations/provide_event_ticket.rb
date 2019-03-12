class Mutations::ProvideEventTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :event_id, Integer, required: true, camelize: false
  argument :ticket_type_id, Integer, required: true, camelize: false
  argument :user_con_profile_id, Integer, required: true, camelize: false

  def resolve(**args)
    event = convention.events.find(args[:event_id])
    ticket_type = convention.ticket_types.find(args[:ticket_type_id])
    user_con_profile = convention.user_con_profiles.find(args[:user_con_profile_id])

    result = ProvideEventTicketService.new(event, user_con_profile, ticket_type).call!

    { ticket: result.ticket }
  end
end
