Mutations::CreateTeamMember = GraphQL::Relay::Mutation.define do
  name "CreateTeamMember"
  return_field :team_member, Types::TeamMemberType

  input_field :event_id, !types.Int
  input_field :user_con_profile_id, !types.Int
  input_field :team_member, !Types::TeamMemberInputType

  resolve ->(_obj, args, ctx) {
    event = ctx[:convention].events.find(args[:event_id])
    user_con_profile = ctx[:convention].user_con_profiles.find(args[:user_con_profile_id])

    team_member = event.team_members.create!(
      args[:team_member].to_h.merge(
        user_con_profile: user_con_profile,
        updated_by: ctx[:user_con_profile].user
      )
    )

    { team_member: team_member }
  }
end
