# frozen_string_literal: true
class Types::UserSignupConstraintsType < Types::BaseObject
  description "The signup constraints on a user for a particular convention."

  field :at_maximum_signups,
        Boolean,
        description: "Is this user currently at their maximum allowed signups?",
        null: false,
        method: :at_maximum_signups?
  field :current_signup_count, Int, null: false, description: "The current number of counted signups for this user."
  # This is the profile of the request, not the one the constraints are for, which is what
  # ContextAccessors#user_con_profile returns on the original engine
  field :user_con_profile,
        Types::UserConProfileType,
        null: false,
        resolve_static: :context_user_con_profile,
        description: "The user profile these constraints describe."

  def self.context_user_con_profile(context)
    context[:user_con_profile]
  end
end
