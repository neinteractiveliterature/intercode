# frozen_string_literal: true
class Mutations::DeleteCouponApplication < Mutations::BaseMutation
  field :coupon_application, Types::CouponApplicationType, null: false
  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_model_with_id CouponApplication, :id, :manage_coupons

  def resolve(**_args)
    coupon_application.destroy!
    { coupon_application: coupon_application }
  end
end
