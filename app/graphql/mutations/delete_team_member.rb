# frozen_string_literal: true
class Mutations::DeleteTeamMember < Mutations::BaseMutation
  field :team_member, Types::TeamMemberType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_model_with_id TeamMember, :id, :destroy

  def resolve(**_args)
    team_member.destroy!
    { team_member: team_member }
  end
end
