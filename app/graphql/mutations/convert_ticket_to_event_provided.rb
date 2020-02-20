class Mutations::ConvertTicketToEventProvided < Mutations::BaseMutation
  field :deleted_ticket, Types::TicketType,
    'The ticket we deleted in order to provide a new ticket',
    null: false
  field :refund_status, Types::RefundStatusType, null: false
  field :ticket, Types::TicketType, 'The new ticket we just provided', null: false

  argument :event_id, Int, required: true, camelize: false
  argument :ticket_type_id, Int, required: true, camelize: false
  argument :user_con_profile_id, Int, required: true, camelize: false

  attr_reader :event, :subject_profile

  define_authorization_check do |args|
    @event = convention.events.find(args[:event_id])
    @subject_profile = convention.user_con_profiles.find(args[:user_con_profile_id])
    policy(user_con_profile.ticket).destroy? && policy(TeamMember.new(event: event)).update?
  end

  def resolve(**args)
    ticket_type = convention.ticket_types.find(args[:ticket_type_id])
    existing_ticket = subject_profile.ticket
    unless existing_ticket
      raise "#{subject_profile.name_without_nickname} has no #{convention.ticket_name}"
    end

    delete_result = DeleteTicketService.new(ticket: existing_ticket, refund: existing_ticket.charge_id.present?).call!
    subject_profile.reload
    result = ProvideEventTicketService.new(event, subject_profile, ticket_type).call!

    {
      ticket: result.ticket,
      deleted_ticket: existing_ticket,
      refund_status: delete_result.refund_status.to_s.upcase
    }
  end
end
