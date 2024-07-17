# frozen_string_literal: true
class Mutations::DeleteUserConProfile < Mutations::BaseMutation
  field :user_con_profile, Types::UserConProfileType, null: false

  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :user_con_profiles, :id, :destroy

  def resolve(**_args)
    user_con_profile.destroy!

    { user_con_profile: }
  end
end
