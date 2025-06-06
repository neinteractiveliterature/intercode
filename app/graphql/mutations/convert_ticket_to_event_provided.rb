# frozen_string_literal: true
class Mutations::ConvertTicketToEventProvided < Mutations::BaseMutation
  field :deleted_ticket, Types::TicketType, "The ticket we deleted in order to provide a new ticket", null: false
  field :refund_status, Types::RefundStatusType, null: false
  field :ticket, Types::TicketType, "The new ticket we just provided", null: false

  argument :event_id, ID, required: false, camelize: true
  argument :ticket_type_id, ID, required: false, camelize: true
  argument :user_con_profile_id, ID, required: false, camelize: true

  attr_reader :event, :subject_profile

  define_authorization_check do |args|
    @event = convention.events.find(args[:event_id])
    @subject_profile = convention.user_con_profiles.find(args[:user_con_profile_id])
    policy(user_con_profile.ticket).destroy? && policy(TeamMember.new(event:)).update?
  end

  def resolve(**args)
    ticket_type = convention.ticket_types.find(args[:ticket_type_id])
    existing_ticket = subject_profile.ticket
    raise "#{subject_profile.name_without_nickname} has no #{convention.ticket_name}" unless existing_ticket

    delete_result =
      DeleteTicketService.new(
        ticket: existing_ticket,
        whodunit: current_user,
        refund: existing_ticket.order_entry.present?,
        operation_name: "conversion to event-provided ticket"
      ).call!
    subject_profile.reload
    result = ProvideEventTicketService.new(event, subject_profile, ticket_type).call!

    { ticket: result.ticket, deleted_ticket: existing_ticket, refund_status: delete_result.refund_status.to_s.upcase }
  end
end
