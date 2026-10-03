# frozen_string_literal: true
require "test_helper"
require_relative "convention_permissions_test_helper"

class CouponApplicationPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention) }
  let(:order) { create(:order, user_con_profile: create(:user_con_profile, convention:)) }
  let(:order_user) { order.user_con_profile.user }
  let(:coupon_application) { order.coupon_applications.create!(coupon: create(:coupon, convention:)) }

  it "lets users manage coupon applications on their own pending orders" do
    assert_policy_allows CouponApplicationPolicy, order_user, coupon_application, :manage?, convention
  end

  it "does not let users manage coupon applications on their own paid orders" do
    coupon_application
    order.update!(status: "paid")

    assert_not CouponApplicationPolicy.new(order_user, coupon_application).manage?
  end

  it "lets users with update_orders manage coupon applications" do
    user = create_user_with_update_orders_in_convention(convention)
    assert_policy_allows CouponApplicationPolicy, user, coupon_application, :manage?, convention
  end

  it "does not let other users manage coupon applications" do
    assert_not CouponApplicationPolicy.new(create(:user), coupon_application).manage?
  end

  it "does not let anonymous users manage coupon applications" do
    assert_not CouponApplicationPolicy.new(nil, coupon_application).manage?
  end
end
