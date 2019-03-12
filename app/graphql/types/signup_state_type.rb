class Types::SignupStateType < Types::BaseEnum
  value('confirmed')
  value('waitlisted')
  value('withdrawn')
end
