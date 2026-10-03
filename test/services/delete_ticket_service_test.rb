# frozen_string_literal: true
require "test_helper"

describe DeleteTicketService do
  include ActiveJob::TestHelper

  let(:convention) { create(:convention, :with_notification_templates, stripe_account_id: "acct_123") }
  let(:user_con_profile) { create(:user_con_profile, convention:) }
  let(:whodunit) { create(:user) }
  let(:ticket_type) { create(:paid_ticket_type, convention:) }
  let(:product) { ticket_type.providing_products.first }
  let(:order) do
    create(
      :order,
      user_con_profile:,
      status: "paid",
      charge_id: "ch_123",
      payment_amount: Money.new(2000, "USD"),
      payment_note: "Paid via Stripe"
    )
  end
  let(:order_entry) { order.order_entries.create!(product:, quantity: 1, price_per_item: Money.new(2000, "USD")) }
  let(:ticket) { create(:ticket, ticket_type:, user_con_profile:, order_entry:) }
  let(:stripe_calls) { { refunds: [] } }

  def with_stripe(&)
    charge = Struct.new(:refunded, :refunds).new(false, [])
    Stripe::Charge.stub(:retrieve, charge) do
      Stripe::Refund.stub(
        :create,
        ->(*args) do
          stripe_calls[:refunds] << args
          Struct.new(:id).new("re_123")
        end,
        &
      )
    end
  end

  describe "a ticket with no order" do
    let(:ticket) { create(:ticket, user_con_profile:) }

    it "just destroys the ticket" do
      ticket
      result = DeleteTicketService.new(ticket:, refund: false, whodunit:).call!

      assert_equal :not_refunded, result.refund_status
      assert_not Ticket.exists?(ticket.id)
    end

    it "can't be refunded, since there's nothing to refund" do
      result = DeleteTicketService.new(ticket:, refund: true, whodunit:).call

      assert result.failure?
      assert_match(/no associated order/, result.errors.full_messages.join)
      assert Ticket.exists?(ticket.id)
    end
  end

  describe "a ticket that is the only item in its order" do
    it "cancels the order and refunds it if requested" do
      with_stripe do
        result = DeleteTicketService.new(ticket:, refund: true, whodunit:).call!

        assert_equal :refunded, result.refund_status
      end

      assert_equal "cancelled", order.reload.status
      assert_not Ticket.exists?(ticket.id)
      assert_equal [[{ charge: "ch_123", amount: 2000 }, { stripe_account: "acct_123" }]], stripe_calls[:refunds]
    end

    it "cancels the order without refunding if not requested" do
      with_stripe do
        result = DeleteTicketService.new(ticket:, refund: false, whodunit:).call!

        assert_equal :not_refunded, result.refund_status
      end

      assert_equal "cancelled", order.reload.status
      assert_not Ticket.exists?(ticket.id)
      assert_empty stripe_calls[:refunds]
    end

    it "doesn't split the order" do
      ticket
      with_stripe do
        assert_no_difference("Order.count") { DeleteTicketService.new(ticket:, refund: true, whodunit:).call! }
      end
    end
  end

  describe "a ticket in an order with several of the same item" do
    let(:order_entry) { order.order_entries.create!(product:, quantity: 3, price_per_item: Money.new(2000, "USD")) }
    let(:order) do
      create(:order, user_con_profile:, status: "paid", charge_id: "ch_123", payment_amount: Money.new(6000, "USD"))
    end

    it "splits the ticket off into its own order and cancels only that order" do
      ticket
      with_stripe do
        assert_difference("Order.count", 1) do
          DeleteTicketService.new(ticket:, refund: true, whodunit:, operation_name: "a test").call!
        end
      end

      order.reload
      split_order = Order.where.not(id: order.id).last

      assert_equal "paid", order.status
      assert_equal 2, order.order_entries.first.quantity
      assert_equal Money.new(4000, "USD"), order.payment_amount

      assert_equal "cancelled", split_order.status
      assert_match(/Split from order ##{order.id} in a test/, split_order.payment_note)
      assert_not Ticket.exists?(ticket.id)
      assert_equal [[{ charge: "ch_123", amount: 2000 }, { stripe_account: "acct_123" }]], stripe_calls[:refunds]
    end

    it "defaults the operation name in the split order's note" do
      ticket
      with_stripe { DeleteTicketService.new(ticket:, refund: false, whodunit:).call! }

      assert_match(/in ticket deletion/, Order.where.not(id: order.id).last.payment_note)
    end
  end

  describe "a ticket in an order with other products" do
    let(:other_product) { create(:product, convention:) }
    let(:order) do
      create(:order, user_con_profile:, status: "paid", charge_id: "ch_123", payment_amount: Money.new(4000, "USD"))
    end

    before { order.order_entries.create!(product: other_product, quantity: 1, price_per_item: Money.new(2000, "USD")) }

    it "leaves the other items on the original order" do
      ticket
      with_stripe { DeleteTicketService.new(ticket:, refund: true, whodunit:).call! }

      order.reload
      assert_equal "paid", order.status
      assert_equal [other_product], order.order_entries.map(&:product)
      assert_equal Money.new(2000, "USD"), order.payment_amount
      assert_not Ticket.exists?(ticket.id)
    end
  end
end
