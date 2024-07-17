# frozen_string_literal: true
class Mutations::ProvideEventTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :event_id, ID, required: false, camelize: true
  argument :ticket_type_id, ID, required: false, camelize: true
  argument :user_con_profile_id, ID, required: false, camelize: true

  attr_reader :event, :ticket_type, :subject_profile

  define_authorization_check do |args|
    @event = convention.events.find(args[:event_id])
    @ticket_type = convention.ticket_types.find(args[:ticket_type_id])
    @subject_profile = convention.user_con_profiles.find(args[:user_con_profile_id])

    self.class.return_true_or_not_authorized_error(
      policy(TeamMember.new(event:)).update?,
      current_user,
      message: "You are not authorized to update team members in this event."
    )
    self.class.return_true_or_not_authorized_error(
      policy(
        Ticket.new(ticket_type:, user_con_profile: subject_profile, provided_by_event: event)
      ).provide?,
      current_user,
      message:
        "You are not authorized to provide #{ticket_type.description} \
#{convention.ticket_name.pluralize} for #{subject_profile.name}."
    )
  end

  def resolve(**_args)
    result = ProvideEventTicketService.new(event.reload, subject_profile, ticket_type).call!

    { ticket: result.ticket }
  end
end
