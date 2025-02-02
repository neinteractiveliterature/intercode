class Types::UserSignupConstraintsType < Types::BaseObject
  description "The signup constraints on a user for a particular convention."

  field :at_maximum_signups,
        Boolean,
        description: "Is this user currently at their maximum allowed signups?",
        null: false,
        method: :at_maximum_signups?
  field :current_signup_count, Int, null: false, description: "The current number of counted signups for this user."
  field :user_con_profile,
        Types::UserConProfileType,
        null: false,
        description: "The user profile these constraints describe."
end
