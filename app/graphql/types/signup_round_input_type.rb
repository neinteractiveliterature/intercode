class Types::SignupRoundInputType < Types::BaseInputObject
  description "An input for creating or modifying SignupRounds."

  argument :automation_action, Types::SignupRoundAutomationAction, required: false, camelize: false do
    description "The action to take when this signup round opens."
  end
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
  argument :rerandomize_lottery_numbers,
           Boolean,
           required: false,
           camelize: false,
           description:
             "If true, the automation will reassign random lottery numbers to all attendees before executing this round"
  argument :start, Types::DateType, required: false, description: "The time that this signup round starts"
end
