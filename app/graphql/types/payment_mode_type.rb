Types::PaymentModeType = GraphQL::EnumType.define do
  name 'PaymentMode'

  value('now')
  value('later')
end
