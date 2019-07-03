require 'test_helper'

class TicketTypePolicyTest < ActiveSupport::TestCase
  describe '#read?' do
    it 'lets anyone read any ticket type' do
      ticket_type = FactoryBot.create(:free_ticket_type)
      assert TicketTypePolicy.new(nil, ticket_type).read?
    end
  end

  describe '#manage?' do
    it 'lets con staff manage ticket types' do
      ticket_type = FactoryBot.create(:free_ticket_type)
      user_con_profile = FactoryBot.create(:staff_user_con_profile, convention: ticket_type.convention)
      assert TicketTypePolicy.new(user_con_profile.user, ticket_type).manage?
    end

    it 'does not let non-staff manage ticket types' do
      ticket_type = FactoryBot.create(:free_ticket_type)
      user_con_profile = FactoryBot.create(:user_con_profile, convention: ticket_type.convention)
      refute TicketTypePolicy.new(user_con_profile.user, ticket_type).manage?
    end
  end

  describe 'Scope' do
    it 'always returns all ticket types' do
      FactoryBot.create_list(:free_ticket_type, 3)
      assert_equal 3, TicketTypePolicy::Scope.new(nil, TicketType.all).resolve.count
    end
  end
end
