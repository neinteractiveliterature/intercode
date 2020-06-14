class Mutations::DeleteCoupon < Mutations::BaseMutation
  field :coupon, Types::CouponType, null: false

  argument :id, Integer, required: true

  load_and_authorize_convention_associated_model :coupons, :id, :destroy

  def resolve(**_args)
    coupon.destroy!
    { coupon: coupon }
  end
end
