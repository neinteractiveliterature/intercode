# frozen_string_literal: true
class Types::RefundStatusType < Types::BaseEnum
  value "NOT_REFUNDED", "No refund was attempted"
  value "REFUNDED", "A refund was successfully provided"
  value "ALREADY_REFUNDED", "A refund was requested, but the charge had already been refunded"
end
