class Types::SignupRoundInputType < Types::BaseInputObject
  description "An input for creating or modifying SignupRounds."

  argument :maximum_event_signups,
           String,
           required: false,
           camelize: false,
           description: "The maximum number of signups allowed during this signup round"
  argument :ranked_choice_order,
           Types::RankedChoiceOrder,
           required: false,
           camelize: false,
           description: "For ranked-choice conventions, the order to execute signup choices in"
  argument :start, Types::DateType, required: false, description: "The time that this signup round starts"
end
