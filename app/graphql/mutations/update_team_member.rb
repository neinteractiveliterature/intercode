class Mutations::UpdateTeamMember < Mutations::BaseMutation
  field :team_member, Types::TeamMemberType, null: false

  argument :id, Integer, required: true
  argument :team_member, Types::TeamMemberInputType, required: true

  def resolve(**args)
    team_member = TeamMember.find(args[:id])

    team_member.update!(
      args[:team_member].to_h.merge(
        updated_by: user_con_profile.user
      )
    )

    { team_member: team_member }
  end
end
