require 'test_helper'

class OrderEntryPolicyTest < ActiveSupport::TestCase
  describe '#read?' do
    it 'lets me read order entries I made' do
      order = create(:order)
      order_entry = create(:order_entry, order: order)
      assert OrderEntryPolicy.new(order.user_con_profile.user, order_entry).read?
    end

    it 'does not let me read order entries other people made' do
      order = create(:order)
      order_entry = create(:order_entry, order: order)
      refute OrderEntryPolicy.new(create(:user), order_entry).read?
    end
  end

  describe '#manage?' do
    %w[pending].each do |status|
      it "lets me manage entries in my own #{status} orders" do
        order = create(:order, status: status)
        order_entry = create(:order_entry, order: order)
        assert OrderEntryPolicy.new(order.user_con_profile.user, order_entry).manage?
      end

      it "does not let me manage entries in other people's #{status} orders" do
        order = create(:order, status: status)
        order_entry = create(:order_entry, order: order)
        refute OrderEntryPolicy.new(create(:user), order_entry).manage?
      end
    end

    (Order::STATUSES - %w[pending]).each do |status|
      it "does not let me manage entries in my own #{status} orders" do
        order = create(:order, status: status)
        order_entry = create(:order_entry, order: order)
        refute OrderEntryPolicy.new(order.user_con_profile.user, order_entry).manage?
      end

      it "does not let me manage entries in other people's #{status} orders" do
        order = create(:order, status: status)
        order_entry = create(:order_entry, order: order)
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

    it 'lets con staff see all the order entries in the con' do
      me = create(:staff_user_con_profile)
      my_orders = create_list(:order, 3, user_con_profile: me)
      my_order_entries = my_orders.map { |order| create(:order_entry, order: order) }
      someone = create(:user_con_profile, convention: me.convention)
      someones_orders = create_list(:order, 3, user_con_profile: someone)
      someones_order_entries = someones_orders.map do |order|
        create(:order_entry, order: order)
      end
      other_orders = create_list(:order, 3)
      other_orders.map { |order| create(:order_entry, order: order) }
      resolved_order_entries = OrderEntryPolicy::Scope.new(me.user, OrderEntry.all).resolve.to_a

      assert_equal (my_order_entries + someones_order_entries).sort, resolved_order_entries.sort
    end
  end
end
