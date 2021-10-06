# frozen_string_literal: true
class Types::CouponApplicationType < Types::BaseObject
  field :id,
        Int,
        deprecation_reason:
          "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :coupon, Types::CouponType, null: false
  field :order, Types::OrderType, null: false
  field :discount, Types::MoneyType, null: false

  association_loaders CouponApplication, :coupon, :order
end
