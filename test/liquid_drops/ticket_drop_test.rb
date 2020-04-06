require 'test_helper'

describe TicketDrop do
  let(:convention) { create(:convention) }
  let(:user_con_profile) { create(:user_con_profile, convention: convention) }
  let(:event) { create(:event, convention: convention) }
  let(:ticket) { create(:ticket, user_con_profile: user_con_profile, provided_by_event: event) }
  let(:ticket_drop) { TicketDrop.new(ticket) }
  let(:ticket_type) { ticket.ticket_type }

  %w[user_con_profile provided_by_event ticket_type].each do |field|
    it "returns the #{field} of the ticket" do
      assert_equal ticket.public_send(field), ticket_drop.public_send(field)
    end
  end

  %w[name description].each do |field|
    it "returns the #{field} of the ticket type" do
      assert_equal ticket_type.public_send(field), ticket_drop.public_send("ticket_type_#{field}")
    end
  end
end
