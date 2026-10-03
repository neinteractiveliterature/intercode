# frozen_string_literal: true
require "test_helper"

describe CancelOrderService do
  include ActiveJob::TestHelper

  let(:convention) { create(:convention, :with_notification_templates, stripe_account_id: "acct_123") }
  let(:user_con_profile) { create(:user_con_profile, convention:) }
  let(:whodunit) { create(:user, first_name: "Cancelling", last_name: "Admin") }
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
  let(:order_entry) { order.order_entries.create!(product:, quantity: 1) }
  let(:ticket) { create(:ticket, ticket_type:, user_con_profile:, order_entry:) }

  def stub_charge(refunded:, refunds: [])
    Struct.new(:refunded, :refunds).new(refunded, refunds)
  end

  def with_stripe(charge:, refund: Struct.new(:id).new("re_123"))
    calls = { charge_retrievals: [], refunds: [] }
    Stripe::Charge.stub(
      :retrieve,
      ->(*args) do
        calls[:charge_retrievals] << args
        charge
      end
    ) do
      Stripe::Refund.stub(
        :create,
        ->(*args) do
          calls[:refunds] << args
          refund
        end
      ) { yield calls }
    end
  end

  before { ticket }

  describe "a paid order with a Stripe charge" do
    it "refunds the charge in full on the convention's connected account" do
      with_stripe(charge: stub_charge(refunded: false)) do |calls|
        result = CancelOrderService.new(order:, whodunit:).call!

        assert_equal :refunded, result.refund_status
        assert_equal [[{ charge: "ch_123", amount: 2000 }, { stripe_account: "acct_123" }]], calls[:refunds]
        assert_equal [["ch_123", { stripe_account: "acct_123" }]], calls[:charge_retrievals]
      end
    end

    it "cancels the order, destroys its tickets, and records who cancelled it" do
      with_stripe(charge: stub_charge(refunded: false)) { CancelOrderService.new(order:, whodunit:).call! }

      order.reload
      assert_equal "cancelled", order.status
      assert_match(/Cancelled\s+\(refunded\) by Cancelling Admin/, order.payment_note)
      assert_match(/Paid via Stripe\z/, order.payment_note)
      assert_not Ticket.exists?(ticket.id)
    end

    it "notifies the customer" do
      with_stripe(charge: stub_charge(refunded: false)) do
        assert_enqueued_jobs(1) { CancelOrderService.new(order:, whodunit:).call! }
      end
    end

    it "doesn't refund twice if the charge was already refunded" do
      existing_refund = Struct.new(:id).new("re_existing")
      charge = stub_charge(refunded: true, refunds: [existing_refund])

      with_stripe(charge:) do |calls|
        result = CancelOrderService.new(order:, whodunit:).call!

        assert_equal :already_refunded, result.refund_status
        assert_empty calls[:refunds]
      end
      assert_equal "cancelled", order.reload.status
    end

    it "skips the refund when asked to" do
      with_stripe(charge: stub_charge(refunded: false)) do |calls|
        result = CancelOrderService.new(order:, whodunit:, skip_refund: true).call!

        assert_equal :not_refunded, result.refund_status
        assert_empty calls[:charge_retrievals]
        assert_empty calls[:refunds]
      end
      assert_equal "cancelled", order.reload.status
      assert_not Ticket.exists?(ticket.id)
    end

    it "leaves the order alone if Stripe fails" do
      failing = ->(*) { raise Stripe::InvalidRequestError.new("no such charge", "charge") }

      Stripe::Charge.stub(:retrieve, failing) do
        assert_raises(Stripe::InvalidRequestError) { CancelOrderService.new(order:, whodunit:).call! }
      end

      assert_equal "paid", order.reload.status
      assert Ticket.exists?(ticket.id)
    end
  end

  describe "a paid order with no charge ID" do
    before { order.update!(charge_id: nil) }

    it "cancels without talking to Stripe" do
      Stripe::Charge.stub(:retrieve, ->(*) { flunk "should not talk to Stripe" }) do
        result = CancelOrderService.new(order:, whodunit:).call!
        assert_equal :not_refunded, result.refund_status
      end

      assert_equal "cancelled", order.reload.status
    end
  end

  describe "an unpaid order" do
    before { order.update!(status: "unpaid", charge_id: nil) }

    it "is marked as cancelled while unpaid" do
      CancelOrderService.new(order:, whodunit:).call!

      order.reload
      assert_equal "cancelled", order.status
      assert_match(/Cancelled unpaid by Cancelling Admin/, order.payment_note)
    end
  end

  it "is a failure if the order is already cancelled" do
    order.update!(status: "cancelled")

    result = CancelOrderService.new(order:, whodunit:).call

    assert result.failure?
    assert_match(/already cancelled/, result.errors.full_messages.join)
    assert Ticket.exists?(ticket.id)
  end
end
