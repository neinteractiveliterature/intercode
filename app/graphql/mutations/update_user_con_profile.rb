# frozen_string_literal: true
class Mutations::UpdateUserConProfile < Mutations::BaseMutation
  field :user_con_profile, Types::UserConProfileType, null: false

  argument :id, ID, required: false
  argument :user_con_profile, Types::UserConProfileInputType, required: true, camelize: false

  attr_reader :user_con_profile

  load_and_authorize_model_with_id UserConProfile, :id, :update

  def resolve(**args)
    user_con_profile_attrs = args[:user_con_profile].to_h.stringify_keys
    if user_con_profile_attrs.key?("form_response_attrs_json")
      user_con_profile.assign_form_response_attributes(
        user_con_profile.filter_form_response_attributes_for_assignment(
          JSON.parse(user_con_profile_attrs.delete("form_response_attrs_json")),
          convention.user_con_profile_form.form_items,
          context[:pundit_user]
        )
      )
    end
    user_con_profile.assign_attributes(user_con_profile_attrs)
    user_con_profile.needs_update = false
    user_con_profile.save!

    { user_con_profile: }
  end
end
