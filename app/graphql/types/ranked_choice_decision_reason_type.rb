class Types::RankedChoiceDecisionReasonType < Types::BaseEnum
  description <<~MARKDOWN
    The reason the ranked choice automation algorithm made the decision it did when evaluating a particular choice.
  MARKDOWN

  # missing_ticket no_more_signups_allowed no_pending_choices conflict full ranked_choice_user_constraints
  value "MISSING_TICKET",
        "Tickets are required in this convention and this user doesn't have one",
        value: "missing_ticket"
  value "NO_MORE_SIGNUPS_ALLOWED",
        "This user already has the maximum number of allowed signups at this time",
        value: "no_more_signups_allowed"
  value "NO_PENDING_CHOICES", "This user has no more pending ranked choices in their queue", value: "no_pending_choices"
  value "CONFLICT", "This choice would conflict with an existing signup this user has", value: "conflict"
  value "FULL", "This event is full", value: "full"
  value "RANKED_CHOICE_USER_CONSTRAINTS",
        "The user's personal constraints prohibit signing up for this event (in conjunction with their existing signups\
)",
        value: "ranked_choice_user_constraints"
end
