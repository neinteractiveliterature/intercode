require 'test_helper'

class PayOrderServiceTest < ActiveSupport::TestCase
  let(:convention) do
    create(:convention, :with_notification_templates,
      starts_at: 2.days.from_now, ends_at: 4.days.from_now)
  end
  let(:user_con_profile) { create(:user_con_profile, convention: convention) }
  let(:order) { create(:order, user_con_profile: user_con_profile) }
  let(:stripe_helper) { StripeMock.create_test_helper }
  let(:stripe_token) { stripe_helper.generate_card_token }

  before { StripeMock.start }
  after { StripeMock.stop }

  subject { PayOrderService.new(order, stripe_token) }

  describe 'ticket-providing products' do
    let(:ticket_type) { create(:paid_ticket_type, convention: convention) }
    let(:order_entry) do
      order.order_entries.create!(
        product: ticket_type.providing_products.first,
        quantity: 1
      )
    end

    before do
      order_entry
    end

    it 'buys a ticket' do
      assert_difference('Ticket.count', 1) { subject.call! }
    end

    describe 'there is a card issue' do
      let(:stripe_token) do
        StripeMock.prepare_card_error(:card_declined)
        stripe_helper.generate_card_token
      end

      it 'fails with an error' do
        result = subject.call
        assert result.failure?
        assert_match(/declined/, result.errors.full_messages.join(', '))
      end
    end

    describe 'if you already have a ticket' do
      before do
        create(:ticket, ticket_type: ticket_type, user_con_profile: user_con_profile)
      end

      it 'fails with an error' do
        result = subject.call
        assert result.failure?
        assert_match(/\AYou already have a ticket/, result.errors.full_messages.join(', '))
      end
    end

    describe 'if the con is sold out' do
      let(:lucky_winner) { create(:user_con_profile, convention: convention) }

      before do
        convention.update!(maximum_tickets: 1)
        create(:ticket, ticket_type: ticket_type, user_con_profile: lucky_winner)
      end

      it 'fails with an error' do
        result = subject.call
        assert result.failure?
        assert_match(/sold out/, result.errors.full_messages.join(', '))
      end
    end

    describe 'if the con is over' do
      before do
        convention.update!(ends_at: 5.minutes.ago)
      end

      it 'fails with an error' do
        result = subject.call
        assert result.failure?
        assert_match(/is over/, result.errors.full_messages.join(', '))
      end
    end
  end
end
