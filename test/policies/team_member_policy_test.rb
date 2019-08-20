require 'test_helper'
require_relative 'convention_permissions_test_helper'

class TeamMemberPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:team_member) { create(:team_member) }
  let(:event) { team_member.event }
  let(:convention) { event.convention }
  let(:other_team_member) { create(:team_member, event: event) }
  let(:other_event) { create(:event, convention: convention) }
  let(:other_event_team_member) { create(:team_member, event: other_event) }

  describe '#read?' do
    it 'lets users read team memberships in their own events' do
      assert TeamMemberPolicy.new(other_team_member.user_con_profile.user, team_member).read?
    end

    it 'lets users read team memberships in other events' do
      assert TeamMemberPolicy.new(other_event_team_member.user_con_profile.user, team_member).read?
    end

    it 'does not let users read team memberships in other events they cannot read' do
      convention.update!(show_schedule: 'no', show_event_list: 'no')
      refute TeamMemberPolicy.new(other_event_team_member.user_con_profile.user, team_member).read?
    end
  end

  describe '#manage?' do
    it 'lets users with update_event_team_members manage team memberships' do
      user = create_user_with_update_event_team_members_in_convention(convention)
      assert TeamMemberPolicy.new(user, team_member).manage?
    end

    it 'lets users manage team memberships in their own events' do
      assert TeamMemberPolicy.new(other_team_member.user_con_profile.user, team_member).manage?
    end

    it 'does not let users manage team memberships in other events' do
      refute TeamMemberPolicy.new(other_event_team_member.user_con_profile.user, team_member).manage?
    end
  end

  describe 'Scope' do
    let(:all_team_members) { [team_member, other_team_member, other_event_team_member] }

    it 'returns all team memberships in a con for users with update_event_team_members' do
      user = create_user_with_update_event_team_members_in_convention(convention)
      resolved_team_members = TeamMemberPolicy::Scope.new(user, TeamMember.all).resolve

      assert_equal all_team_members.sort, resolved_team_members.sort
    end

    it 'returns all team memberships in your own events but not in other events you cannot read' do
      convention.update!(show_schedule: 'no', show_event_list: 'no')
      all_team_members
      resolved_team_members = TeamMemberPolicy::Scope.new(
        team_member.user_con_profile.user, TeamMember.all
      ).resolve

      assert_equal [team_member, other_team_member].sort, resolved_team_members.sort
    end
  end
end
