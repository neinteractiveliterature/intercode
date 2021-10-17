# frozen_string_literal: true
class Mutations::DeleteCoupon < Mutations::BaseMutation
  field :coupon, Types::CouponType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_convention_associated_model :coupons, :id, :destroy

  def resolve(**_args)
    coupon.destroy!
    { coupon: coupon }
  end
end
