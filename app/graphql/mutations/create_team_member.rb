class Mutations::CreateTeamMember < Mutations::BaseMutation
  field :team_member, Types::TeamMemberType, null: false
  field :ticket, Types::TicketType, null: true

  argument :event_id, Integer, required: true, camelize: false
  argument :user_con_profile_id, Integer, required: true, camelize: false
  argument :team_member, Types::TeamMemberInputType, required: true, camelize: false
  argument :provide_ticket_type_id, Integer, required: false, camelize: false

  def resolve(**args)
    team_member = nil
    ticket = nil

    ActiveRecord::Base.transaction do
      event = convention.events.find(args[:event_id])
      user_con_profile = convention.user_con_profiles.find(args[:user_con_profile_id])

      team_member = event.team_members.create!(
        args[:team_member].to_h.merge(
          user_con_profile: user_con_profile,
          updated_by: user_con_profile.user
        )
      )

      if args[:provide_ticket_type_id]
        ticket_type = convention.ticket_types.find(args[:provide_ticket_type_id])
        result = ProvideEventTicketService.new(event, user_con_profile, ticket_type).call!
        ticket = result.ticket
      end
    end

    { team_member: team_member, ticket: ticket }
  end
end
