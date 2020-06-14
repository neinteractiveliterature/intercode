class Mutations::DeleteCouponApplication < Mutations::BaseMutation
  field :coupon_application, Types::CouponApplicationType, null: false
  argument :id, Int, required: true, camelize: false

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
