require 'test_helper'

class TicketPolicyTest < ActiveSupport::TestCase
  describe '#read?' do
    it 'lets me read my own ticket' do
      ticket = FactoryBot.create(:ticket)
      assert TicketPolicy.new(ticket.user_con_profile.user, ticket).read?
    end

    it "does not let me read other people's tickets" do
      ticket = FactoryBot.create(:ticket)
      refute TicketPolicy.new(FactoryBot.create(:user), ticket).read?
    end

    it 'lets event team members read my ticket' do
      ticket = FactoryBot.create(:ticket)
      event = FactoryBot.create(:event, convention: ticket.user_con_profile.convention)
      team_member = FactoryBot.create(:team_member, event: event)
      assert TicketPolicy.new(team_member.user_con_profile.user, ticket).read?
    end

    it 'lets users with the con_com privilege read my ticket' do
      ticket = FactoryBot.create(:ticket)
      con_com_profile = FactoryBot.create(
        :user_con_profile,
        convention: ticket.user_con_profile.convention,
        con_com: true
      )
      assert TicketPolicy.new(con_com_profile.user, ticket).read?
    end
  end

  describe '#manage?' do
    it 'does not let me manage my own ticket' do
      ticket = FactoryBot.create(:ticket)
      refute TicketPolicy.new(ticket.user_con_profile.user, ticket).manage?
    end

    it 'lets con staff manage my ticket' do
      ticket = FactoryBot.create(:ticket)
      staff_profile = FactoryBot.create(
        :staff_user_con_profile,
        convention: ticket.user_con_profile.convention
      )
      assert TicketPolicy.new(staff_profile.user, ticket).manage?
    end
  end

  describe 'Scope' do
    it "lets me see my own tickets but not other people's" do
      my_ticket = FactoryBot.create(:ticket)
      me = my_ticket.user_con_profile
      other_profiles = FactoryBot.create_list(:user_con_profile, 3, convention: me.convention)
      other_profiles.each { |p| FactoryBot.create(:ticket, user_con_profile: p) }
      resolved_tickets = TicketPolicy::Scope.new(me.user, Ticket.all).resolve.to_a

      assert_equal [my_ticket], resolved_tickets
    end

    it 'lets con com users see all the tickets in the con' do
      me = FactoryBot.create(:user_con_profile, con_com: true)
      my_ticket = FactoryBot.create(:ticket, user_con_profile: me)
      someone = FactoryBot.create(:user_con_profile, convention: me.convention)
      someones_ticket = FactoryBot.create(:ticket, user_con_profile: someone)
      FactoryBot.create_list(:ticket, 3)
      resolved_tickets = TicketPolicy::Scope.new(me.user, Ticket.all).resolve.to_a

      assert_equal [my_ticket, someones_ticket].sort, resolved_tickets.sort
    end

    it 'lets event team members see all the tickets in the con' do
      team_member = FactoryBot.create(:team_member)
      me = team_member.user_con_profile
      my_ticket = FactoryBot.create(:ticket, user_con_profile: me)
      someone = FactoryBot.create(:user_con_profile, convention: me.convention)
      someones_ticket = FactoryBot.create(:ticket, user_con_profile: someone)
      FactoryBot.create_list(:ticket, 3)
      resolved_tickets = TicketPolicy::Scope.new(me.user, Ticket.all).resolve.to_a

      assert_equal [my_ticket, someones_ticket].sort, resolved_tickets.sort
    end
  end
end
