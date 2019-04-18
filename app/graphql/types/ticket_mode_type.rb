class Types::TicketModeType < Types::BaseEnum
  value('disabled', 'Tickets are neither sold nor required in this convention')
  value(
    'required_for_signup',
    'A valid ticket is required to sign up for events in this convention'
  )
end
