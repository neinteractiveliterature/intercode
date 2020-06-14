class Mutations::CreateCoupon < Mutations::BaseMutation
  field :coupon, Types::CouponType, null: false

  argument :coupon, Types::CouponInputType, required: true
  authorize_create_convention_associated_model :coupons

  def resolve(**args)
    coupon_fields = args[:coupon].to_h

    if coupon_fields[:fixed_amount].present?
      coupon_fields[:fixed_amount] = MoneyHelper.coerce_money_input(coupon_fields[:fixed_amount])
    end

    coupon = convention.coupons.create!(coupon_fields)

    { coupon: coupon }
  end
end
