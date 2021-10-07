# frozen_string_literal: true
class Mutations::CreateTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :user_con_profile_id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_user_con_profile_id, ID, required: false, camelize: true
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
