# frozen_string_literal: true
class Mutations::DeleteUserConProfile < Mutations::BaseMutation
  field :user_con_profile, Types::UserConProfileType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :user_con_profiles, :id, :destroy

  def resolve(**_args)
    user_con_profile.destroy!

    { user_con_profile: user_con_profile }
  end
end
