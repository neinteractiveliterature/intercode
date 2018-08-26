Mutations::DeleteUserConProfile = GraphQL::Relay::Mutation.define do
  name 'DeleteUserConProfile'
  return_field :user_con_profile, Types::UserConProfileType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    user_con_profile = ctx[:convention].user_con_profiles.find(args[:id])
    user_con_profile.destroy!

    { user_con_profile: user_con_profile }
  }
end
