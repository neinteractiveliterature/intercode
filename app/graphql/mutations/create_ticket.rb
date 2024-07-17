# frozen_string_literal: true
class Mutations::CreateTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :ticket, Types::TicketInputType, required: true
  argument :user_con_profile_id, ID, required: false, camelize: true

  attr_reader :ticket_profile

  define_authorization_check do |args|
    @ticket_profile = convention.user_con_profiles.find(args[:user_con_profile_id])
    policy(Ticket.new(user_con_profile: ticket_profile)).create?
  end

  def resolve(**args)
    ticket = ticket_profile.create_ticket!(args[:ticket].to_h)

    { ticket: }
  end
end
