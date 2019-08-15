require 'test_helper'
require_relative 'convention_permissions_test_helper'

class TicketPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:ticket) { create(:ticket) }
  let(:ticket_user) { ticket.user_con_profile.user }
  let(:convention) { ticket.user_con_profile.convention }

  describe '#read?' do
    it 'lets me read my own ticket' do
      assert TicketPolicy.new(ticket_user, ticket).read?
    end

    it "does not let me read other people's tickets" do
      refute TicketPolicy.new(create(:user), ticket).read?
    end

    it 'lets event team members read my ticket' do
      event = create(:event, convention: convention)
      team_member = create(:team_member, event: event)
      assert TicketPolicy.new(team_member.user_con_profile.user, ticket).read?
    end

    it 'lets users with read_tickets in convention read my ticket' do
      user = create_user_with_read_tickets_in_convention(convention)
      assert TicketPolicy.new(user, ticket).read?
    end
  end

  describe '#provide?' do
    it 'lets con staff provide tickets to events' do
      event = create(:event)
      team_member = create(:team_member, event: event)
      user_con_profile = create(:staff_user_con_profile, convention: event.convention)
      recipient = create(:user_con_profile, convention: event.convention)
      ticket = build(:ticket, user_con_profile: recipient, provided_by_event: event)
      assert TicketPolicy.new(user_con_profile.user, ticket).provide?
    end

    it 'lets event team members provide tickets to their own event' do
      event = create(:event)
      team_member = create(:team_member, event: event)
      recipient = create(:user_con_profile, convention: event.convention)
      ticket = build(:ticket, user_con_profile: recipient, provided_by_event: event)
      assert TicketPolicy.new(team_member.user_con_profile.user, ticket).provide?
    end

    it 'does not let event team members provide tickets to other events' do
      event = create(:event)
      team_member = create(:team_member)
      recipient = create(:user_con_profile, convention: event.convention)
      ticket = build(:ticket, user_con_profile: recipient, provided_by_event: event)
      refute TicketPolicy.new(team_member.user_con_profile.user, ticket).provide?
    end

    it 'does not let regular users provide tickets' do
      event = create(:event)
      user_con_profile = create(:user_con_profile, convention: event.convention)
      recipient = create(:user_con_profile, convention: event.convention)
      ticket = build(:ticket, user_con_profile: recipient, provided_by_event: event)
      refute TicketPolicy.new(user_con_profile.user, ticket).provide?
    end
  end

  describe '#manage?' do
    it 'does not let me manage my own ticket' do
      refute TicketPolicy.new(ticket_user, ticket).manage?
    end

    it 'lets con staff manage my ticket' do
      staff_profile = create(:staff_user_con_profile, convention: convention)
      assert TicketPolicy.new(staff_profile.user, ticket).manage?
    end
  end

  describe 'Scope' do
    it "lets me see my own tickets but not other people's" do
      my_ticket = create(:ticket)
      me = my_ticket.user_con_profile
      other_profiles = create_list(:user_con_profile, 3, convention: me.convention)
      other_profiles.each { |p| create(:ticket, user_con_profile: p) }
      resolved_tickets = TicketPolicy::Scope.new(me.user, Ticket.all).resolve.to_a

      assert_equal [my_ticket], resolved_tickets
    end

    it 'lets users with read_tickets permission see all the tickets in the con' do
      convention = create(:convention)
      me = create_user_with_read_tickets_in_convention(convention)
      my_ticket = create(:ticket, user_con_profile: me.user_con_profiles.first)
      someone = create(:user_con_profile, convention: convention)
      someones_ticket = create(:ticket, user_con_profile: someone)
      create_list(:ticket, 3)
      resolved_tickets = TicketPolicy::Scope.new(me, Ticket.all).resolve.to_a

      assert_equal [my_ticket, someones_ticket].sort, resolved_tickets.sort
    end

    it 'lets event team members see all the tickets in the con' do
      team_member = create(:team_member)
      me = team_member.user_con_profile
      my_ticket = create(:ticket, user_con_profile: me)
      someone = create(:user_con_profile, convention: me.convention)
      someones_ticket = create(:ticket, user_con_profile: someone)
      create_list(:ticket, 3)
      resolved_tickets = TicketPolicy::Scope.new(me.user, Ticket.all).resolve.to_a

      assert_equal [my_ticket, someones_ticket].sort, resolved_tickets.sort
    end
  end
end
