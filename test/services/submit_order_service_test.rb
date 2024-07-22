require "test_helper"

class SubmitOrderServiceTest < ActiveSupport::TestCase
  let(:convention) do
    create(:convention, :with_notification_templates, starts_at: 2.days.from_now, ends_at: 4.days.from_now)
  end
  let(:user_con_profile) { create(:user_con_profile, convention:) }
  let(:order) { create(:order, user_con_profile:) }

  describe "ticket-providing products" do
    let(:ticket_type) { create(:paid_ticket_type, convention:) }
    let(:order_entry) { order.order_entries.create!(product: ticket_type.providing_products.first, quantity: 1) }

    before { order_entry }

    it "buys a ticket" do
      mocking_payment_intent do |payment_intent|
        assert_difference("Ticket.count", 1) do
          SubmitOrderService.new(order, payment_mode: "now", payment_intent_id: payment_intent.id).call!
        end
      end
    end

    describe "there is a card issue" do
      it "does not mark the order as paid" do
        mocking_payment_intent(status: "unpaid") do |payment_intent|
          SubmitOrderService.new(order, payment_mode: "now", payment_intent_id: payment_intent.id).call!
          assert_equal "unpaid", order.reload.status
        end
      end
    end

    describe "if you already have a ticket" do
      before { create(:ticket, ticket_type:, user_con_profile:) }

      it "fails with an error" do
        mocking_payment_intent do |payment_intent|
          result = SubmitOrderService.new(order, payment_mode: "now", payment_intent_id: payment_intent.id).call
          assert result.failure?
          assert_match(/\AYou already have a ticket/, result.errors.full_messages.join(", "))
        end
      end
    end

    describe "if the con is sold out" do
      let(:lucky_winner) { create(:user_con_profile, convention:) }

      before do
        convention.update!(maximum_tickets: 1)
        create(:ticket, ticket_type:, user_con_profile: lucky_winner)
      end

      it "fails with an error" do
        mocking_payment_intent do |payment_intent|
          result = SubmitOrderService.new(order, payment_mode: "now", payment_intent_id: payment_intent.id).call
          assert result.failure?
          assert_match(/sold out/, result.errors.full_messages.join(", "))
        end
      end
    end

    describe "if the con is over" do
      before { convention.update!(ends_at: 5.minutes.ago) }

      it "fails with an error" do
        mocking_payment_intent do |payment_intent|
          result = SubmitOrderService.new(order, payment_mode: "now", payment_intent_id: payment_intent.id).call
          assert result.failure?
          assert_match(/is over/, result.errors.full_messages.join(", "))
        end
      end
    end
  end

  private

  def build_payment_intent(status: "succeeded")
    Stripe::PaymentIntent.construct_from(
      {
        id: "pi_12345",
        amount: 100,
        currency: "usd",
        payment_method: "tok_12345",
        status:,
        latest_charge: {
          id: "ch_12345",
          created: Time.now.to_i
        }
      }
    )
  end

  def mocking_payment_intent(**args, &)
    payment_intent = build_payment_intent(**args)
    Stripe::PaymentIntent.stub :retrieve, payment_intent do
      yield payment_intent
    end
  end
end
