class Types::SignupAutomationModeType < Types::BaseEnum
  description <<~MARKDOWN
    The automation behavior to use for event signups in a Convention.  Currently, we only support one type of
    automated signups, the "ranked choice" behavior.  Conventions can also disable automation entirely using the
    "none" value.
  MARKDOWN

  value("none", "Signups are fully manual")
  value(
    "ranked_choice",
    "Attendees make a ranked list of choices and the site attempts to give everyone what they want"
  )
end
