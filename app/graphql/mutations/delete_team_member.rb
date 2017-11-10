Mutations::DeleteTeamMember = GraphQL::Relay::Mutation.define do
  name "DeleteTeamMember"
  return_field :team_member, Types::TeamMemberType

  input_field :id, !types.Int

  resolve ->(_obj, args, _ctx) {
    team_member = TeamMember.find(args[:id])
    team_member.destroy!
    { team_member: team_member }
  }
end
