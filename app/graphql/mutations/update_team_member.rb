# frozen_string_literal: true
class Mutations::UpdateTeamMember < Mutations::BaseMutation
  field :team_member, Types::TeamMemberType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :team_member, Types::TeamMemberInputType, required: true, camelize: false

  load_and_authorize_model_with_id TeamMember, :id, :update

  def resolve(**args)
    team_member.update!(args[:team_member].to_h.merge(updated_by: user_con_profile.user))

    { team_member: team_member }
  end
end
