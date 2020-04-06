require 'test_helper'
require_relative 'convention_permissions_test_helper'

class OrderEntryPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:order) { create(:order) }
  let(:order_entry) { create(:order_entry, order: order) }
  let(:order_user) { order.user_con_profile.user }
  let(:convention) { order.user_con_profile.convention }

  describe '#read?' do
    it 'lets me read order entries I made' do
      assert OrderEntryPolicy.new(order_user, order_entry).read?
    end

    it 'lets users with read_orders permission read order entries I made' do
      user = create_user_with_read_orders_in_convention(convention)
      assert OrderEntryPolicy.new(user, order_entry).read?
    end

    it 'does not let me read order entries other people made' do
      refute OrderEntryPolicy.new(create(:user), order_entry).read?
    end
  end

  describe '#manage?' do
    %w[pending].each do |status|
      it "lets me manage entries in my own #{status} orders" do
        order.update!(status: status)
        assert OrderEntryPolicy.new(order_user, order_entry).manage?
      end

      it "does not let me manage entries in other people's #{status} orders" do
        order.update!(status: status)
        refute OrderEntryPolicy.new(create(:user), order_entry).manage?
      end
    end

    (Types::OrderStatusType.values.keys - %w[pending]).each do |status|
      it "does not let me manage entries in my own #{status} orders" do
        order.update!(status: status)
        refute OrderEntryPolicy.new(order_user, order_entry).manage?
      end

      it "does not let me manage entries in other people's #{status} orders" do
        order.update!(status: status)
        refute OrderEntryPolicy.new(create(:user), order_entry).manage?
      end
    end
  end

  describe 'Scope' do
    it "lets me see my own order entries but not other people's" do
      me = create(:user_con_profile)
      my_orders = create_list(:order, 3, user_con_profile: me)
      my_order_entries = my_orders.map { |order| create(:order_entry, order: order) }
      other_orders = create_list(:order, 3)
      other_orders.map { |order| create(:order_entry, order: order) }
      resolved_order_entries = OrderEntryPolicy::Scope.new(me.user, OrderEntry.all).resolve.to_a

      assert_equal my_order_entries.sort, resolved_order_entries.sort
    end

    %w[read_orders update_orders].each do |permission|
      it "lets users with #{permission} see all the order entries in the con" do
        convention = create(:convention)
        me = create_user_with_permission_in_convention(permission, convention)
        my_orders = create_list(:order, 3, user_con_profile: me.user_con_profiles.first)
        my_order_entries = my_orders.map { |order| create(:order_entry, order: order) }
        someone = create(:user_con_profile, convention: convention)
        someones_orders = create_list(:order, 3, user_con_profile: someone)
        someones_order_entries = someones_orders.map do |order|
          create(:order_entry, order: order)
        end
        other_orders = create_list(:order, 3)
        other_orders.map { |order| create(:order_entry, order: order) }
        resolved_order_entries = OrderEntryPolicy::Scope.new(me, OrderEntry.all).resolve.to_a

        assert_equal (my_order_entries + someones_order_entries).sort, resolved_order_entries.sort
      end
    end
  end
end
