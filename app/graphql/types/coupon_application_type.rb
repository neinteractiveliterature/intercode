class Types::CouponApplicationType < Types::BaseObject
  field :id, Int, null: false
  field :coupon, Types::CouponType, null: false
  field :order, Types::OrderType, null: false
  field :discount, Types::MoneyType, null: false

  association_loaders CouponApplication, :coupon, :order
end
