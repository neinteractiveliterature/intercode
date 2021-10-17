# frozen_string_literal: true
class Mutations::DeleteCouponApplication < Mutations::BaseMutation
  field :coupon_application, Types::CouponApplicationType, null: false
  argument :id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_model_with_id CouponApplication, :id, :manage_coupons

  def resolve(**_args)
    coupon_application.destroy!
    { coupon_application: coupon_application }
  end
end
