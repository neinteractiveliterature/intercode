class Mutations::UpdateUserConProfile < Mutations::BaseMutation
  field :user_con_profile, Types::UserConProfileType, null: false

  argument :id, Integer, required: true
  argument :user_con_profile, Types::UserConProfileInputType, required: true, camelize: false

  def resolve(**args)
    user_con_profile = convention.user_con_profiles.find(args[:id])
    user_con_profile_attrs = args[:user_con_profile].to_h.stringify_keys
    if user_con_profile_attrs.key?('form_response_attrs_json')
      user_con_profile.assign_form_response_attributes(
        JSON.parse(user_con_profile_attrs.delete('form_response_attrs_json'))
      )
    end
    user_con_profile.assign_attributes(user_con_profile_attrs)
    user_con_profile.save!

    { user_con_profile: user_con_profile }
  end
end
