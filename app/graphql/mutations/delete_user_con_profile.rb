class Mutations::DeleteUserConProfile < Mutations::BaseMutation
  field :user_con_profile, Types::UserConProfileType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    user_con_profile = convention.user_con_profiles.find(args[:id])
    user_con_profile.destroy!

    { user_con_profile: user_con_profile }
  end
end
