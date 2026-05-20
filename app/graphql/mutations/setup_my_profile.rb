# frozen_string_literal: true
class Mutations::SetupMyProfile < Mutations::BaseMutation
  description "Creates a UserConProfile for the currently signed-in user in the current convention."

  field :my_profile, Types::UserConProfileType, null: false, description: "The created or existing profile."

  require_user

  def authorized?
    !!current_user && !!convention
  end

  def resolve
    existing = convention.user_con_profiles.find_by(user: current_user)
    return { my_profile: existing } if existing

    result = SetupUserConProfileService.new(convention:, user: current_user).call!
    { my_profile: result.user_con_profile }
  end
end
