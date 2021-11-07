# frozen_string_literal: true
class Types::CouponApplicationType < Types::BaseObject
  field :transitional_id,
        ID,
        deprecation_reason:
          "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
        null: false,
        method: :id,
        camelize: true
  field :id, ID, null: false
  field :coupon, Types::CouponType, null: false
  field :order, Types::OrderType, null: false
  field :discount, Types::MoneyType, null: false

  association_loaders CouponApplication, :coupon, :order
end
