class Mutations::ProvideEventTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :event_id, Integer, required: true, camelize: false
  argument :ticket_type_id, Integer, required: true, camelize: false
  argument :user_con_profile_id, Integer, required: true, camelize: false

  attr_reader :event, :ticket_type, :subject_profile

  def authorized?(args)
    @event = convention.events.find(args[:event_id])
    @ticket_type = convention.ticket_types.find(args[:ticket_type_id])
    @subject_profile = convention.user_con_profiles.find(args[:user_con_profile_id])

    policy(TeamMember.new(event: event)).update? &&
      policy(Ticket.new(ticket_type: ticket_type, user_con_profile: subject_profile)).create?
  end

  def resolve(**_args)
    result = ProvideEventTicketService.new(event, subject_profile, ticket_type).call!

    { ticket: result.ticket }
  end
end
