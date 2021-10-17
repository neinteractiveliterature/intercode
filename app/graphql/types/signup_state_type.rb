# frozen_string_literal: true
class Types::SignupStateType < Types::BaseEnum
  value('confirmed')
  value('waitlisted')
  value('withdrawn')
end
