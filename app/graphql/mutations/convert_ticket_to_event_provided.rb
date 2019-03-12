class Mutations::ConvertTicketToEventProvided < Mutations::BaseMutation
  field :deleted_ticket, Types::TicketType,
    'The ticket we deleted in order to provide a new ticket',
    null: false
  field :refund_status, Types::RefundStatusType, null: false
  field :ticket, Types::TicketType, 'The new ticket we just provided', null: false

  argument :event_id, Int, required: true, camelize: false
  argument :ticket_type_id, Int, required: true, camelize: false
  argument :user_con_profile_id, Int, required: true, camelize: false

  def resolve(event_id:, ticket_type_id:, user_con_profile_id:)
    event = convention.events.find(event_id)
    ticket_type = convention.ticket_types.find(ticket_type_id)
    user_con_profile = convention.user_con_profiles.find(user_con_profile_id)
    existing_ticket = user_con_profile.ticket
    raise "#{user_con_profile.name_without_nickname} has no #{convention.ticket_name}" unless existing_ticket

    delete_result = DeleteTicketService.new(ticket: existing_ticket, refund: existing_ticket.charge_id.present?).call!
    user_con_profile.reload
    result = ProvideEventTicketService.new(event, user_con_profile, ticket_type).call!

    {
      ticket: result.ticket,
      deleted_ticket: existing_ticket,
      refund_status: delete_result.refund_status.to_s.upcase
    }
  end
end
