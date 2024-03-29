require 'test_helper'

describe ProvideEventTicketService do
  let(:convention) { create(:convention) }
  let(:event_category) { create(:event_category, convention: convention, can_provide_tickets: true) }
  let(:event) { create(:event, convention: convention, event_category: event_category) }
  let(:ticket_type) { create(:event_provided_ticket_type, convention: convention) }
  let(:user_con_profile) { create(:user_con_profile, convention: convention) }
  let(:service) { ProvideEventTicketService.new(event, user_con_profile, ticket_type) }

  it 'provides a ticket' do
    result = service.call
    assert result.success?
    assert result.ticket.persisted?
    assert_equal result.ticket.ticket_type, ticket_type
    assert_equal result.ticket.user_con_profile, user_con_profile
    assert_equal result.ticket.convention, convention
    assert_equal result.ticket.provided_by_event, event
  end

  describe 'if the user already has a ticket' do
    let(:paid_ticket_type) { create(:paid_ticket_type, convention: convention) }

    before { user_con_profile.create_ticket!(ticket_type: paid_ticket_type) }

    it 'fails' do
      result = service.call
      assert result.failure?
      assert_match /already has a ticket/, result.errors.full_messages.join("\n")
    end
  end

  describe 'if the event cannot provide tickets' do
    let(:event_category) { create(:event_category, convention: convention, can_provide_tickets: false) }

    it 'fails' do
      result = service.call
      assert result.failure?
      assert_match /cannot provide tickets/, result.errors.full_messages.join("\n")
    end
  end

  describe 'if the ticket type is not event-providable' do
    let(:ticket_type) { create(:paid_ticket_type, convention: convention) }

    it 'fails' do
      result = service.call
      assert result.failure?
      assert_match /cannot be provided/, result.errors.full_messages.join("\n")
    end
  end

  describe 'if the event has already provided all the tickets it can' do
    before do
      2.times do
        other_user_con_profile = create(:user_con_profile, convention: convention)
        create(:ticket, user_con_profile: other_user_con_profile, ticket_type: ticket_type, provided_by_event: event)
      end
    end

    it 'fails' do
      result = service.call
      assert result.failure?
      assert_match /has already provided/, result.errors.full_messages.join("\n")
    end
  end
end
