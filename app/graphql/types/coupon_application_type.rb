# frozen_string_literal: true
class Types::CouponApplicationType < Types::BaseObject
  field :coupon, Types::CouponType, null: false
  field :discount, Types::MoneyType, null: false
  field :id, ID, null: false
  field :order, Types::OrderType, null: false

  association_loaders CouponApplication, :coupon, :order
end
