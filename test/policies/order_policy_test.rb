require 'test_helper'
require_relative 'convention_permissions_test_helper'

class OrderPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:order) { create(:order) }
  let(:order_user) { order.user_con_profile.user }
  let(:convention) { order.user_con_profile.convention }

  describe '#read?' do
    it 'lets me read orders I made' do
      assert OrderPolicy.new(order_user, order).read?
    end

    it 'lets users with read_orders permission read orders I made' do
      user = create_user_with_read_orders_in_convention(order.user_con_profile.convention)
      assert OrderPolicy.new(user, order).read?
    end

    it 'does not let me read orders other people made' do
      refute OrderPolicy.new(create(:user), order).read?
    end
  end

  describe '#submit?' do
    %w[pending unpaid].each do |status|
      it "lets me submit my own #{status} orders" do
        order.update!(status: status)
        assert OrderPolicy.new(order_user, order).submit?
      end

      it "does not let me submit other people's #{status} orders" do
        order.update!(status: status)
        refute OrderPolicy.new(create(:user), order).submit?
      end
    end

    (Types::OrderStatusType.values.keys - %w[pending unpaid]).each do |status|
      it "does not let me submit my own #{status} orders" do
        order.update!(status: status)
        refute OrderPolicy.new(order_user, order).submit?
      end

      it "does not let me submit other people's #{status} orders" do
        order.update!(status: status)
        refute OrderPolicy.new(create(:user), order).submit?
      end
    end
  end

  # cancel and manage are synonymous, for now
  %w[cancel manage].each do |action|
    describe "##{action}?" do
      it "does not let regular users #{action} their own orders" do
        refute OrderPolicy.new(order_user, order).public_send("#{action}?")
      end

      it "lets users with update_orders #{action} attendees' orders" do
        user = create_user_with_update_orders_in_convention(convention)
        assert OrderPolicy.new(user, order).public_send("#{action}?")
      end

      it "does not let user with update_orders in other conventions #{action} attendees' orders" do
        user = create_user_with_update_orders_in_convention(create(:convention))
        refute OrderPolicy.new(user, order).public_send("#{action}?")
      end
    end
  end

  describe 'Scope' do
    it "lets me see my own orders but not other people's" do
      me = create(:user_con_profile)
      my_orders = create_list(:order, 3, user_con_profile: me)
      create_list(:order, 3)
      resolved_orders = OrderPolicy::Scope.new(me.user, Order.all).resolve.to_a

      assert_equal my_orders.sort, resolved_orders.sort
    end

    it 'lets users with read_orders permission see all the orders in the con' do
      convention = create(:convention)
      me = create_user_with_read_orders_in_convention(convention)
      my_orders = create_list(:order, 3, user_con_profile: me.user_con_profiles.first)
      someone = create(:user_con_profile, convention: convention)
      someones_orders = create_list(:order, 3, user_con_profile: someone)
      create_list(:order, 3)
      resolved_orders = OrderPolicy::Scope.new(me, Order.all).resolve.to_a

      assert_equal (my_orders + someones_orders).sort, resolved_orders.sort
    end
  end
end
