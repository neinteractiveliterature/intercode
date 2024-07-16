require "test_helper"

class SubmitOrderServiceTest < ActiveSupport::TestCase
  let(:convention) do
    create(:convention, :with_notification_templates, starts_at: 2.days.from_now, ends_at: 4.days.from_now)
  end
  let(:user_con_profile) { create(:user_con_profile, convention:) }
  let(:order) { create(:order, user_con_profile:) }
  let(:stripe_helper) { StripeMock.create_test_helper }
  let(:payment_intent) do
    Stripe::PaymentIntent.create(
      { amount: 100, currency: "usd", payment_method: stripe_helper.generate_card_token, confirm: true }
    )
  end

  before { StripeMock.start }
  after { StripeMock.stop }

  subject { SubmitOrderService.new(order, payment_mode: "now", payment_intent_id: payment_intent.id) }

  describe "ticket-providing products" do
    let(:ticket_type) { create(:paid_ticket_type, convention:) }
    let(:order_entry) { order.order_entries.create!(product: ticket_type.providing_products.first, quantity: 1) }

    before { order_entry }

    it "buys a ticket" do
      assert_difference("Ticket.count", 1) { subject.call! }
    end

    describe "there is a card issue" do
      let(:payment_intent) do
        Stripe::PaymentIntent.create(
          { amount: 3178, currency: "usd", payment_method: stripe_helper.generate_card_token, confirm: true }
        )
      end

      it "does not mark the order as paid" do
        subject.call
        assert_equal "unpaid", order.reload.status
      end
    end

    describe "if you already have a ticket" do
      before { create(:ticket, ticket_type:, user_con_profile:) }

      it "fails with an error" do
        result = subject.call
        assert result.failure?
        assert_match(/\AYou already have a ticket/, result.errors.full_messages.join(", "))
      end
    end

    describe "if the con is sold out" do
      let(:lucky_winner) { create(:user_con_profile, convention:) }

      before do
        convention.update!(maximum_tickets: 1)
        create(:ticket, ticket_type:, user_con_profile: lucky_winner)
      end

      it "fails with an error" do
        result = subject.call
        assert result.failure?
        assert_match(/sold out/, result.errors.full_messages.join(", "))
      end
    end

    describe "if the con is over" do
      before { convention.update!(ends_at: 5.minutes.ago) }

      it "fails with an error" do
        result = subject.call
        assert result.failure?
        assert_match(/is over/, result.errors.full_messages.join(", "))
      end
    end
  end
end
