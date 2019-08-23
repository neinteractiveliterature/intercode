require 'test_helper'

class UserConProfileTest < ActiveSupport::TestCase
  describe 'is_team_member' do
    it 'finds a user who is a team member for an event' do
      team_member = create(:team_member)
      assert UserConProfile.is_team_member.to_a.include?(team_member.user_con_profile)
    end

    it "doesn't find a user who isn't a team member" do
      user_con_profile = create(:user_con_profile)
      refute UserConProfile.is_team_member.to_a.include?(user_con_profile)
    end

    it 'scopes correctly by convention' do
      team_member = create(:team_member)
      other_convention = create(:convention)

      assert team_member.event.convention.user_con_profiles.is_team_member.to_a.include?(team_member.user_con_profile)
      refute other_convention.user_con_profiles.is_team_member.to_a.include?(team_member.user_con_profile)
    end
  end
end
