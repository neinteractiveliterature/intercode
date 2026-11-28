# frozen_string_literal: true
class Types::CouponApplicationType < Types::BaseObject
  description "A coupon that has been applied to an order"
  field :coupon,
        Types::CouponType,
        association_model: CouponApplication,
        null: false,
        description: "The coupon that was applied"
  field :discount, Types::MoneyType, null: false, description: "How much the coupon takes off the order"
  field :id, ID, null: false, description: "The ID of this coupon application"
  field :order,
        Types::OrderType,
        association_model: CouponApplication,
        null: false,
        description: "The order the coupon was applied to"
end
