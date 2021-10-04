# frozen_string_literal: true
class Mutations::UpdateCoupon < Mutations::BaseMutation
  field :coupon, Types::CouponType, null: false

  argument :id,
           Int,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :coupon, Types::CouponInputType, required: true
  load_and_authorize_convention_associated_model :coupons, :id, :update

  def resolve(**args)
    coupon_fields = args[:coupon].to_h

    if coupon_fields[:fixed_amount].present?
      coupon_fields[:fixed_amount] = MoneyHelper.coerce_money_input(coupon_fields[:fixed_amount])
    end

    coupon.update!(coupon_fields)

    { coupon: coupon }
  end
end
