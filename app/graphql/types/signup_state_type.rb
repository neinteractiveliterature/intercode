# frozen_string_literal: true
class Types::SignupStateType < Types::BaseEnum
  value(
    "ticket_purchase_hold",
    'Attendee\'s spot is held temporarily while the attendee finishes paying for their ticket'
  )
  value("confirmed", 'Attendee\'s spot is confirmed')
  value("waitlisted", "Attendee is on the waitlist for this event and may be pulled in automatically")
  value("withdrawn", "Attendee has withdrawn from this event (and this signup is no longer valid)")
end
