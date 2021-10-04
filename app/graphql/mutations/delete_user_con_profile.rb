# frozen_string_literal: true
class Mutations::DeleteUserConProfile < Mutations::BaseMutation
  field :user_con_profile, Types::UserConProfileType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_convention_associated_model :user_con_profiles, :id, :destroy

  def resolve(**_args)
    user_con_profile.destroy!

    { user_con_profile: user_con_profile }
  end
end
