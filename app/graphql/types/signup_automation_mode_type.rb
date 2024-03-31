class Types::SignupAutomationModeType < Types::BaseEnum
  value("none", "Signups are fully manual")
  value(
    "ranked_choice",
    "Attendees make a ranked list of choices and the site attempts to give everyone what they want"
  )
end
