# frozen_string_literal: true
class Types::ReceiveSignupEmailType < Types::BaseEnum
  value "ALL_SIGNUPS", "Receive email for all signup activity"
  value "NON_WAITLIST_SIGNUPS", "Receive email for signup activity affecting confirmed signups"
  value "NO", "Do not receive signup email"
end
