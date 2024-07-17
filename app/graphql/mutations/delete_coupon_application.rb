# frozen_string_literal: true
class Mutations::DeleteCouponApplication < Mutations::BaseMutation
  field :coupon_application, Types::CouponApplicationType, null: false

  argument :id, ID, required: false

  load_and_authorize_model_with_id CouponApplication, :id, :manage_coupons

  def resolve(**_args)
    coupon_application.destroy!
    { coupon_application: }
  end
end
