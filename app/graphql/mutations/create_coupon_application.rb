# frozen_string_literal: true
class Mutations::CreateCouponApplication < Mutations::BaseMutation
  field :coupon_application, Types::CouponApplicationType, null: false
  argument :coupon_code, String, required: true, camelize: false
  argument :transitional_order_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the orderId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :order_id, ID, required: false, camelize: true

  load_and_authorize_model_with_id Order, :id, :manage_coupons, argument_name: :order_id

  def resolve(coupon_code:, **_args)
    convention = order.user_con_profile.convention
    coupon = convention.coupons.where('lower(code) = ?', coupon_code.downcase.strip).first
    raise GraphQL::ExecutionError, "No coupon with code “#{coupon_code}” found in #{convention.name}" unless coupon
    raise GraphQL::ExecutionError, "Coupon #{coupon.code} is expired" if coupon.expired?
    raise GraphQL::ExecutionError, "Coupon #{coupon.code} has been used up already" if coupon.usage_limit_reached?

    coupon_application = order.coupon_applications.create!(coupon: coupon)
    { coupon_application: coupon_application }
  end
end
