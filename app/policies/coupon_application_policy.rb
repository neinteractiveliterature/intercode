# frozen_string_literal: true
class CouponApplicationPolicy < ApplicationPolicy
  delegate :order, to: :record

  def manage?
    OrderPolicy.new(authorization_info, order).manage_coupons?
  end
end
