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

  attr_reader :coupon_application
  def authorized?(args)
    @coupon_application = CouponApplication.find(args[:id])
    self.class.check_authorization(policy(coupon_application.order), :manage_coupons)
  end

  def resolve(**_args)
    coupon_application.destroy!
    { coupon_application: coupon_application }
  end
end
