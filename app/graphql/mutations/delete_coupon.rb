# frozen_string_literal: true
class Mutations::DeleteCoupon < Mutations::BaseMutation
  field :coupon, Types::CouponType, null: false

  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :coupons, :id, :destroy

  def resolve(**_args)
    coupon.destroy!
    { coupon: }
  end
end
