# frozen_string_literal: true
class Mutations::CreateTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :transitional_user_con_profile_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the userConProfileId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :user_con_profile_id, ID, required: false, camelize: true
  argument :ticket, Types::TicketInputType, required: true

  attr_reader :ticket_profile

  define_authorization_check do |args|
    @ticket_profile =
      convention.user_con_profiles.find(args[:transitional_user_con_profile_id] || args[:user_con_profile_id])
    policy(Ticket.new(user_con_profile: ticket_profile)).create?
  end

  def resolve(**args)
    attrs = process_transitional_ids_in_input(args[:ticket].to_h, :ticket_type_id, :provided_by_event_id)
    ticket = ticket_profile.create_ticket!(attrs)

    { ticket: ticket }
  end
end
