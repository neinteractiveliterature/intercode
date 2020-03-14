class Types::EmailModeType < Types::BaseEnum
  value('forward', 'Forward received emails to staff positions as configured')
  value(
    'staff_emails_to_catch_all',
    'Forward all received staff emails to catch-all staff position'
  )
end
