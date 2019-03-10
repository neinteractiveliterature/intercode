class Mutations::DeleteTeamMember < Mutations::BaseMutation
  field :team_member, Types::TeamMemberType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    team_member = TeamMember.find(args[:id])
    team_member.destroy!
    { team_member: team_member }
  end
end
