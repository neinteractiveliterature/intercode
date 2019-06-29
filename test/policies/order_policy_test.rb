require 'test_helper'

class OrderPolicyTest < ActiveSupport::TestCase
  describe '#read?' do
    it 'lets me read orders I made' do
      order = FactoryBot.create(:order)
      assert OrderPolicy.new(order.user_con_profile.user, order).read?
    end

    it 'does not let me read orders other people made' do
      order = FactoryBot.create(:order)
      refute OrderPolicy.new(FactoryBot.create(:user), order).read?
    end
  end

  describe '#submit?' do
    %w[pending unpaid].each do |status|
      it "lets me submit my own #{status} orders" do
        order = FactoryBot.create(:order, status: status)
        assert OrderPolicy.new(order.user_con_profile.user, order).submit?
      end

      it "does not let me submit other people's #{status} orders" do
        order = FactoryBot.create(:order, status: status)
        refute OrderPolicy.new(FactoryBot.create(:user), order).submit?
      end
    end

    (Order::STATUSES - %w[pending unpaid]).each do |status|
      it "does not let me submit my own #{status} orders" do
        order = FactoryBot.create(:order, status: status)
        refute OrderPolicy.new(order.user_con_profile.user, order).submit?
      end

      it "does not let me submit other people's #{status} orders" do
        order = FactoryBot.create(:order, status: status)
        refute OrderPolicy.new(FactoryBot.create(:user), order).submit?
      end
    end
  end

  # cancel and manage are synonymous, for now
  %w[cancel manage].each do |action|
    describe "##{action}?" do
      it "does not let regular users #{action} their own orders" do
        order = FactoryBot.create(:order)
        refute OrderPolicy.new(order.user_con_profile.user, order).public_send("#{action}?")
      end

      it "lets con staff #{action} attendees' orders" do
        order = FactoryBot.create(:order)
        staff_profile = FactoryBot.create(:staff_user_con_profile, convention: order.user_con_profile.convention)
        assert OrderPolicy.new(staff_profile.user, order).public_send("#{action}?")
      end

      it "does not let staff from other conventions #{action} attendees' orders" do
        order = FactoryBot.create(:order)
        staff_profile = FactoryBot.create(:staff_user_con_profile)
        refute OrderPolicy.new(staff_profile.user, order).public_send("#{action}?")
      end
    end
  end

  describe 'Scope' do
    it "lets me see my own orders but not other people's" do
      me = FactoryBot.create(:user_con_profile)
      my_orders = FactoryBot.create_list(:order, 3, user_con_profile: me)
      other_orders = FactoryBot.create_list(:order, 3)
      resolved_orders = OrderPolicy::Scope.new(me.user, Order.all).resolve.to_a

      assert_equal my_orders.sort, resolved_orders.sort
    end

    it "lets con staff see all the orders in the con" do
      me = FactoryBot.create(:staff_user_con_profile)
      my_orders = FactoryBot.create_list(:order, 3, user_con_profile: me)
      someone = FactoryBot.create(:user_con_profile, convention: me.convention)
      someones_orders = FactoryBot.create_list(:order, 3, user_con_profile: someone)
      other_orders = FactoryBot.create_list(:order, 3)
      resolved_orders = OrderPolicy::Scope.new(me.user, Order.all).resolve.to_a

      assert_equal (my_orders + someones_orders).sort, resolved_orders.sort
    end
  end
end
