Types::SignupStateType = GraphQL::EnumType.define do
  name 'SignupState'

  value('confirmed')
  value('waitlisted')
  value('withdrawn')
end
