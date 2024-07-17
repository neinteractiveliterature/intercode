# frozen_string_literal: true
class Mutations::DeleteTeamMember < Mutations::BaseMutation
  field :team_member, Types::TeamMemberType, null: false

  argument :id, ID, required: false

  load_and_authorize_model_with_id TeamMember, :id, :destroy

  def resolve(**_args)
    team_member.destroy!
    { team_member: team_member }
  end
end
