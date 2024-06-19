class Types::RankedChoiceDecisionValueType < Types::BaseEnum
  description "The decision the ranked choice automation algorithm made when evaluating a particular choice."

  value "SIGNUP", "Sign the user up for the chosen event", value: "signup"
  value "WAITLIST", "Sign the user up in the waitlist for the chosen event", value: "waitlist"
  value "SKIP_USER", "Skip all remaining choices for this user", value: "skip_user"
  value "SKIP_CHOICE", "Skip this choice but continue evaluating this user's ranked choices", value: "skip_choice"
end
