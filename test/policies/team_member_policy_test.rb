require 'test_helper'

class TeamMemberPolicyTest < ActiveSupport::TestCase
  let(:team_member) { create(:team_member) }
  let(:event) { team_member.event }
  let(:convention) { event.convention }
  let(:other_team_member) { create(:team_member, event: event) }
  let(:other_event) { create(:event, convention: convention) }
  let(:other_event_team_member) { create(:team_member, event: other_event) }

  describe '#read?' do
    %w[gm_liaison con_com].each do |priv|
      it "lets #{priv} users read team memberships" do
        user_con_profile = create(:user_con_profile, convention: convention, priv => true)
        assert TeamMemberPolicy.new(user_con_profile.user, team_member).read?
      end
    end

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
    it 'lets gm_liaison users manage team memberships' do
      user_con_profile = create(:user_con_profile, convention: convention, gm_liaison: true)
      assert TeamMemberPolicy.new(user_con_profile.user, team_member).manage?
    end

    it 'does not let con_com users manage team memberships' do
      user_con_profile = create(:user_con_profile, convention: convention, con_com: true)
      refute TeamMemberPolicy.new(user_con_profile.user, team_member).manage?
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

    %w[gm_liaison con_com].each do |priv|
      it "returns all team memberships in a con for #{priv} users" do
        user_con_profile = create(:user_con_profile, convention: convention, priv => true)
        resolved_team_members = TeamMemberPolicy::Scope.new(
          user_con_profile.user, TeamMember.all
        ).resolve

        assert_equal all_team_members.sort, resolved_team_members.sort
      end
    end

    it 'returns all team memberships in your own events but not in other events' do
      all_team_members
      resolved_team_members = TeamMemberPolicy::Scope.new(
        team_member.user_con_profile.user, TeamMember.all
      ).resolve

      assert_equal [team_member, other_team_member].sort, resolved_team_members.sort
    end
  end
end
