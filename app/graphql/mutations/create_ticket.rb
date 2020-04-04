class Mutations::CreateTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :user_con_profile_id, Int, required: true, camelize: false
  argument :ticket, Types::TicketInputType, required: true

  attr_reader :ticket_profile

  define_authorization_check do |args|
    @ticket_profile = convention.user_con_profiles.find(args[:user_con_profile_id])
    policy(Ticket.new(user_con_profile: ticket_profile)).create?
  end

  def resolve(**args)
    ticket = ticket_profile.create_ticket!(args[:ticket].to_h)

    { ticket: ticket }
  end
end
