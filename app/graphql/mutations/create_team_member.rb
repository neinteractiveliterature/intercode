class Mutations::CreateTeamMember < Mutations::BaseMutation
  field :team_member, Types::TeamMemberType, null: false
  field :ticket, Types::TicketType, null: true
  field :converted_signups, [Types::SignupType], null: false
  field :moved_signups, [Types::SignupMoveResultType], null: false

  argument :event_id, Integer, required: true, camelize: false
  argument :user_con_profile_id, Integer, required: true, camelize: false
  argument :team_member, Types::TeamMemberInputType, required: true, camelize: false
  argument :provide_ticket_type_id, Integer, required: false, camelize: false

  def resolve(**args)
    event = convention.events.find(args[:event_id])
    user_con_profile = convention.user_con_profiles.find(args[:user_con_profile_id])
    result = CreateTeamMemberService.new(
      event: event,
      user_con_profile: user_con_profile,
      team_member_attrs: args[:team_member],
      provide_ticket_type_id: args[:provide_ticket_type_id]
    ).call!

    {
      team_member: result.team_member,
      ticket: result.ticket,
      converted_signups: result.converted_signups,
      moved_signups: result.moved_signups
    }
  end
end
