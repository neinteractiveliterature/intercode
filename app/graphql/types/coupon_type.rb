# frozen_string_literal: true
class Types::CouponType < Types::BaseObject
  description "A discount code that can be applied to orders"
  authorize_record

  field :code, String, null: false, description: "The code people enter to use this coupon"
  field :convention, Types::ConventionType, null: false, description: "The convention this coupon belongs to"
  field :expires_at, Types::DateType, null: true, description: "When this coupon stops working, if it expires"
  field :fixed_amount,
        Types::MoneyType,
        null: true,
        description: "The amount this coupon takes off, if it is a fixed-amount discount"
  field :id, ID, null: false, description: "The ID of this coupon"
  field :percent_discount,
        Types::BigDecimalType,
        null: true,
        description: "The percentage this coupon takes off, if it is a percentage discount"
  field :provides_product,
        Types::ProductType,
        null: true,
        description: "The product this coupon gives away for free, if any"
  field :usage_limit, Int, null: true, description: "The maximum number of times this coupon can be used, if limited"
end
