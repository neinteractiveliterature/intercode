require 'test_helper'

describe TicketDrop do
  let(:convention) { FactoryBot.create(:convention) }
  let(:user_con_profile) { FactoryBot.create(:user_con_profile, convention: convention) }
  let(:event) { FactoryBot.create(:event, convention: convention) }
  let(:ticket) { FactoryBot.create(:ticket, user_con_profile: user_con_profile, provided_by_event: event) }
  let(:ticket_drop) { TicketDrop.new(ticket) }
  let(:ticket_type) { ticket.ticket_type }

  %w[user_con_profile provided_by_event payment_amount].each do |field|
    it "returns the #{field} of the ticket" do
      ticket_drop.public_send(field).must_equal ticket.public_send(field)
    end
  end

  %w[name description].each do |field|
    it "returns the #{field} of the ticket type" do
      ticket_drop.public_send("ticket_type_#{field}").must_equal ticket_type.public_send(field)
    end
  end

  it 'does not expose the ticket type' do
    assert_raises do
      ticket_drop.ticket_type
    end
  end
end
