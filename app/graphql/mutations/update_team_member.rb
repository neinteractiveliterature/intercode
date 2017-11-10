Mutations::UpdateTeamMember = GraphQL::Relay::Mutation.define do
  name "UpdateTeamMember"
  return_field :team_member, Types::TeamMemberType

  input_field :id, !types.Int
  input_field :team_member, !Types::TeamMemberInputType

  resolve ->(_obj, args, ctx) {
    team_member = TeamMember.find(args[:id])

    team_member.update!(
      args[:team_member].to_h.merge(
        updated_by: ctx[:user_con_profile].user
      )
    )

    { team_member: team_member }
  }
end
