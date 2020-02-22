class Mutations::CreateUserConProfile < Mutations::BaseMutation
  field :user_con_profile, Types::UserConProfileType, null: false

  argument :user_id, Integer, required: true, camelize: false
  argument :user_con_profile, Types::UserConProfileInputType, required: true, camelize: false

  authorize_create_convention_associated_model :user_con_profiles

  def resolve(**args)
    user = User.find(args[:user_id])
    user_con_profile = convention.user_con_profiles.new(user: user)
    user_con_profile.assign_default_values_from_form_items(
      convention.user_con_profile_form.form_items
    )

    most_recent_profile = user.user_con_profiles.joins(:convention)
      .order(Arel.sql('conventions.starts_at DESC'))
      .first

    if most_recent_profile
      user_con_profile.assign_form_response_attributes(
        FormResponsePresenter.new(convention.user_con_profile_form, most_recent_profile).as_json
      )
    end

    user_con_profile_attrs = args[:user_con_profile].to_h.stringify_keys
    user_con_profile_attrs.merge!(
      JSON.parse(user_con_profile_attrs.delete('form_response_attrs_json'))
    )
    user_con_profile.assign_attributes(
      user_con_profile_attrs.select { |_key, value| value.present? }.merge(needs_update: true)
    )
    user_con_profile.save!

    { user_con_profile: user_con_profile }
  end
end
