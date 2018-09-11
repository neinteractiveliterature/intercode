Mutations::CreateUserConProfile = GraphQL::Relay::Mutation.define do
  name 'CreateUserConProfile'
  return_field :user_con_profile, Types::UserConProfileType

  input_field :user_id, !types.Int
  input_field :user_con_profile, !Types::UserConProfileInputType

  resolve ->(_obj, args, ctx) {
    user_con_profile = ctx[:convention].user_con_profiles.new(user_id: args[:user_id])
    user_con_profile_attrs = args[:user_con_profile].to_h
    user_con_profile.assign_form_response_attributes(
      JSON.parse(user_con_profile_attrs.delete('form_response_attrs_json'))
    )
    user_con_profile.assign_attributes(user_con_profile_attrs)
    user_con_profile.save!

    { user_con_profile: user_con_profile }
  }
end
