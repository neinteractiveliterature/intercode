# frozen_string_literal: true
require "test_helper"
require_relative "convention_permissions_test_helper"

class CouponPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention) }
  let(:coupon) { create(:coupon, convention:) }

  describe "#read?" do
    it "lets users with update_products read coupons" do
      user = create_user_with_update_products_in_convention(convention)
      assert_policy_allows CouponPolicy, user, coupon, :read?, convention
    end

    it "does not let users with update_products in another convention read coupons" do
      user = create_user_with_update_products_in_convention(create(:convention))
      assert_not CouponPolicy.new(user, coupon).read?
    end

    it "lets users read coupons that have been applied to their own orders" do
      order = create(:order, user_con_profile: create(:user_con_profile, convention:))
      order.coupon_applications.create!(coupon:)

      assert CouponPolicy.new(order.user_con_profile.user, coupon).read?
    end

    it "does not let users read coupons that are applied to other people's orders" do
      order = create(:order, user_con_profile: create(:user_con_profile, convention:))
      order.coupon_applications.create!(coupon:)

      assert_not CouponPolicy.new(create(:user), coupon).read?
    end

    it "does not let anonymous users read coupons" do
      assert_not CouponPolicy.new(nil, coupon).read?
    end

    it "lets site admins read coupons" do
      assert CouponPolicy.new(create(:user, site_admin: true), coupon).read?
    end
  end

  describe "#manage?" do
    it "lets users with update_products manage coupons" do
      user = create_user_with_update_products_in_convention(convention)
      assert_policy_allows CouponPolicy, user, coupon, :manage?, convention
    end

    it "does not let users manage coupons they've merely used" do
      order = create(:order, user_con_profile: create(:user_con_profile, convention:))
      order.coupon_applications.create!(coupon:)

      assert_not CouponPolicy.new(order.user_con_profile.user, coupon).manage?
    end

    it "does not let users with update_products in another convention manage coupons" do
      user = create_user_with_update_products_in_convention(create(:convention))
      assert_not CouponPolicy.new(user, coupon).manage?
    end

    it "lets site admins manage coupons" do
      assert CouponPolicy.new(create(:user, site_admin: true), coupon).manage?
    end
  end

  describe "Scope" do
    it "returns coupons in conventions where you have update_products" do
      other_coupon = create(:coupon, convention: create(:convention))
      user = create_user_with_update_products_in_convention(convention)
      coupon

      resolved = CouponPolicy::Scope.new(user, Coupon.all).resolve

      assert_equal [coupon], resolved.to_a
      assert_not_includes resolved, other_coupon
    end

    it "returns nothing to regular users" do
      coupon
      assert_equal [], CouponPolicy::Scope.new(create(:user), Coupon.all).resolve.to_a
    end

    it "returns everything to site admins" do
      coupon
      assert_equal [coupon], CouponPolicy::Scope.new(create(:user, site_admin: true), Coupon.all).resolve.to_a
    end
  end
end
