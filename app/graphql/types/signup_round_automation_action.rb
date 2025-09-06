class Types::SignupRoundAutomationAction < Types::BaseEnum
  description "An action to take when a signup round opens."

  value "EXECUTE_RANKED_CHOICE",
        "Execute any pending ranked choices as allowed by this signup round",
        value: "execute_ranked_choice"
end
