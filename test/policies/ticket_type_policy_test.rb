require 'test_helper'
require_relative 'convention_permissions_test_helper'

class TicketTypePolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  describe '#read?' do
    it 'lets anyone read any ticket type' do
      ticket_type = create(:free_ticket_type)
      assert TicketTypePolicy.new(nil, ticket_type).read?
    end
  end

  describe '#manage?' do
    it 'lets users with update_ticket_types manage convention ticket types' do
      ticket_type = create(:free_ticket_type)
      user = create_user_with_update_ticket_types_in_convention(ticket_type.convention)
      assert_policy_allows TicketTypePolicy, user, ticket_type, :manage?, ticket_type.convention
    end

    it 'does not let users without update_ticket_types manage convention ticket types' do
      ticket_type = create(:free_ticket_type)
      user_con_profile = create(:user_con_profile, convention: ticket_type.convention)
      refute TicketTypePolicy.new(user_con_profile.user, ticket_type).manage?
    end

    it 'lets team members manage event ticket types' do
      ticket_type = create(:event_specific_ticket_type)
      team_member = create(:team_member, event: ticket_type.event)
      user = team_member.user_con_profile.user
      assert_policy_allows TicketTypePolicy, user, ticket_type, :manage?, ticket_type.event.convention
    end

    it 'does not let non-team members manage event ticket types' do
      signup = create(:signup)
      ticket_type = create(:free_ticket_type, convention: nil, event: signup.event)
      user = signup.user_con_profile.user
      refute TicketTypePolicy.new(user, ticket_type).manage?
    end
  end

  describe 'Scope' do
    it 'always returns all ticket types' do
      create_list(:free_ticket_type, 3)
      assert_equal 3, TicketTypePolicy::Scope.new(nil, TicketType.all).resolve.count
    end
  end
end
