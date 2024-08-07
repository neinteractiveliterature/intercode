# frozen_string_literal: true
class Types::SignupRankedChoiceStateType < Types::BaseEnum
  description "The processing state of a SignupRankedChoice"

  value("pending", "We have not yet attempted to process this choice")
  value("signed_up", "The attendee has been signed up (see the result_signup field for the actual signup)")
  value("waitlisted", "The attendee has been waitlisted (see the result_signup field for the actual signup)")
  value(
    "requested",
    "The attendee has had a signup request put in (see the result_signup_request field for the actual signup request)"
  )
end
