# frozen_string_literal: true
class Mutations::UpdateTeamMember < Mutations::BaseMutation
  field :team_member, Types::TeamMemberType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :team_member, Types::TeamMemberInputType, required: true, camelize: false

  load_and_authorize_model_with_id TeamMember, :id, :update

  def resolve(**args)
    team_member = TeamMember.find(args[:id])

    team_member.update!(args[:team_member].to_h.merge(updated_by: user_con_profile.user))

    { team_member: team_member }
  end
end
