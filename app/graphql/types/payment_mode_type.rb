# frozen_string_literal: true
class Types::PaymentModeType < Types::BaseEnum
  description "How should an order be paid for?"

  value("now", deprecation_reason: "Please use payment_intent instead")
  value("later")
  value("free")
  value("payment_intent")
end
