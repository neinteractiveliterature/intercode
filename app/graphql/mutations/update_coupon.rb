# frozen_string_literal: true
class Mutations::UpdateCoupon < Mutations::BaseMutation
  field :coupon, Types::CouponType, null: false

  argument :coupon, Types::CouponInputType, required: true
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :coupons, :id, :update

  def resolve(**args)
    coupon_fields = args[:coupon].to_h

    if coupon_fields[:fixed_amount].present?
      coupon_fields[:fixed_amount] = MoneyHelper.coerce_money_input(coupon_fields[:fixed_amount])
    end

    coupon.update!(coupon_fields)

    { coupon: }
  end
end
