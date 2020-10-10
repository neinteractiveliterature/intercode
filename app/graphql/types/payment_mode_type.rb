class Types::PaymentModeType < Types::BaseEnum
  value('now')
  value('later')
  value('free')
  value('payment_intent')
end
