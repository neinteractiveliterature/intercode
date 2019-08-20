require 'test_helper'
require_relative 'convention_permissions_test_helper'

class UserConProfilePolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:user_con_profile) { create(:user_con_profile) }
  let(:convention) { user_con_profile.convention }
  let(:event) { create(:event, convention: convention) }
  let(:the_run) { create(:run, event: event) }
  let(:signup) { create(:signup, run: the_run) }
  let(:team_member) { create(:team_member, event: event) }
  let(:staff_profile) { create(:staff_user_con_profile, convention: convention) }
  let(:staff_position) { create(:staff_position, convention: convention) }
  let(:staff_position_profile) do
    create(:user_con_profile, convention: convention, staff_positions: [staff_position])
  end
  let(:rando_profile) { create(:user_con_profile, convention: convention) }

  describe '#read?' do
    %w[
      read_user_con_profiles read_user_con_profile_email read_user_con_profile_personal_info
    ].each do |permission|
      it "lets users with #{permission} read profiles" do
        user = create_user_with_permission_in_convention(permission, convention)
        assert UserConProfilePolicy.new(user, user_con_profile).read?
      end
    end

    it 'lets team members read profiles of anyone in the convention' do
      assert UserConProfilePolicy.new(team_member.user_con_profile.user, user_con_profile).read?
    end

    it 'lets users with read_event_proposals in any event category read profiles' do
      event_category = create(:event_category, convention: convention)
      user = create_user_with_read_event_proposals_in_event_category(event_category)
      assert UserConProfilePolicy.new(user, user_con_profile).read?
    end

    it 'lets users read their own profiles' do
      assert UserConProfilePolicy.new(user_con_profile.user, user_con_profile).read?
    end

    it 'lets users read profiles of people in the same runs as them' do
      other_signup = create(:signup, run: the_run)
      assert UserConProfilePolicy.new(
        signup.user_con_profile.user, other_signup.user_con_profile
      ).read?
    end

    it 'lets users read profiles of privileged users in the convention' do
      assert UserConProfilePolicy.new(rando_profile.user, staff_profile).read?
    end

    it 'lets users read profiles of staff-positioned users in the convention' do
      assert UserConProfilePolicy.new(rando_profile.user, staff_position_profile).read?
    end

    it 'lets users read profiles of team members in the convention' do
      assert UserConProfilePolicy.new(user_con_profile.user, team_member.user_con_profile).read?
    end

    it 'does not let randos read profiles' do
      refute UserConProfilePolicy.new(rando_profile.user, user_con_profile).read?
    end
  end

  describe '#read_email?' do
    %w[read_user_con_profile_email read_user_con_profile_personal_info].each do |permission|
      it "lets users with #{permission} read email addresses" do
        user = create_user_with_permission_in_convention(permission, convention)
        assert UserConProfilePolicy.new(user, user_con_profile).read_email?
      end
    end

    %w[read_user_con_profiles].each do |permission|
      it "does not let users with #{permission} read email addresses" do
        user = create_user_with_permission_in_convention(permission, convention)
        refute UserConProfilePolicy.new(user, user_con_profile).read_email?
      end
    end

    it 'lets team members read emails of anyone in the convention' do
      assert UserConProfilePolicy.new(team_member.user_con_profile.user, user_con_profile)
        .read_email?
    end

    it 'lets users with read_event_proposals in any event category read email addresses' do
      event_category = create(:event_category, convention: convention)
      user = create_user_with_read_event_proposals_in_event_category(event_category)
      assert UserConProfilePolicy.new(user, user_con_profile).read_email?
    end

    it 'lets users read their own email address' do
      assert UserConProfilePolicy.new(user_con_profile.user, user_con_profile).read_email?
    end

    it 'does not let randos read email addresses' do
      refute UserConProfilePolicy.new(rando_profile.user, user_con_profile).read_email?
    end
  end

  describe '#read_personal_info?' do
    %w[read_user_con_profile_personal_info].each do |permission|
      it "lets users with #{permission} read personal info" do
        user = create_user_with_permission_in_convention(permission, convention)
        assert UserConProfilePolicy.new(user, user_con_profile).read_personal_info?
      end
    end

    %w[read_user_con_profiles read_user_con_profile_email].each do |permission|
      it "does not let users with #{permission} read personal_info" do
        user = create_user_with_permission_in_convention(permission, convention)
        refute UserConProfilePolicy.new(user, user_con_profile).read_personal_info?
      end
    end

    it 'lets team members read personal info of attendees in their events' do
      assert UserConProfilePolicy.new(team_member.user_con_profile.user, signup.user_con_profile)
        .read_personal_info?
    end

    it 'lets team members read personal info of co-team-members in their events' do
      other_team_member = create(:team_member, event: team_member.event)
      assert UserConProfilePolicy.new(
        team_member.user_con_profile.user, other_team_member.user_con_profile
      ).read_personal_info?
    end

    it 'does not let team members read personal info of anyone in the convention' do
      refute UserConProfilePolicy.new(team_member.user_con_profile.user, user_con_profile)
        .read_personal_info?
    end

    it 'lets users with read_event_proposals in any event category read personal info' do
      event_category = create(:event_category, convention: convention)
      user = create_user_with_read_event_proposals_in_event_category(event_category)
      assert UserConProfilePolicy.new(user, user_con_profile).read_email?
    end

    it 'lets users read their own personal info' do
      assert UserConProfilePolicy.new(user_con_profile.user, user_con_profile).read_personal_info?
    end

    it 'does not let randos read personal info' do
      refute UserConProfilePolicy.new(rando_profile.user, user_con_profile).read_personal_info?
    end
  end

  %w[create update].each do |action|
    describe "##{action}?" do
      it "lets staff users #{action} other people's profiles" do
        assert UserConProfilePolicy.new(staff_profile.user, user_con_profile)
          .public_send("#{action}?")
      end

      it "lets users #{action} their own profiles" do
        assert UserConProfilePolicy.new(user_con_profile.user, user_con_profile)
          .public_send("#{action}?")
      end

      it "does not let randos #{action} other people's profiles" do
        refute UserConProfilePolicy.new(rando_profile.user, user_con_profile)
          .public_send("#{action}?")
      end
    end
  end

  %w[manage become update_privileges withdraw_all_signups].each do |action|
    describe "##{action}?" do
      it "lets staff users #{action} attendee profiles" do
        assert UserConProfilePolicy.new(staff_profile.user, user_con_profile).withdraw_all_signups?
      end

      it "does not let users #{action} their own profiles" do
        refute UserConProfilePolicy.new(user_con_profile.user, user_con_profile).withdraw_all_signups?
      end

      it "does not let randos #{action} arbitrary profiles" do
        refute UserConProfilePolicy.new(rando_profile.user, user_con_profile).withdraw_all_signups?
      end
    end
  end

  describe 'Scope' do
    before { user_con_profile }

    %w[
      read_user_con_profiles read_user_con_profile_email read_user_con_profile_personal_info
    ].each do |permission|
      it "lets users with #{permission} read profiles" do
        user = create_user_with_permission_in_convention(permission, convention)
        resolved_profiles = UserConProfilePolicy::Scope.new(user, UserConProfile.all).resolve

        assert_equal [user_con_profile, user.user_con_profiles.first].sort, resolved_profiles.sort
      end
    end

    it 'lets team members read profiles of anyone in the convention' do
      resolved_profiles = UserConProfilePolicy::Scope.new(
        team_member.user_con_profile.user, UserConProfile.all
      ).resolve

      assert_equal [user_con_profile, team_member.user_con_profile].sort, resolved_profiles.sort
    end

    it 'lets users with read_event_proposals in any event category read profiles' do
      event_category = create(:event_category, convention: convention)
      user = create_user_with_read_event_proposals_in_event_category(event_category)
      resolved_profiles = UserConProfilePolicy::Scope.new(user, UserConProfile.all).resolve

      assert_equal [user_con_profile, user.user_con_profiles.first].sort, resolved_profiles.sort
    end

    it 'lets users read their own profiles' do
      resolved_profiles = UserConProfilePolicy::Scope.new(
        user_con_profile.user, UserConProfile.all
      ).resolve

      assert_equal [user_con_profile].sort, resolved_profiles.sort
    end

    it 'lets users read profiles of team members in the convention' do
      team_member
      resolved_profiles = UserConProfilePolicy::Scope.new(
        user_con_profile.user, UserConProfile.all
      ).resolve

      assert_equal [user_con_profile, team_member.user_con_profile].sort, resolved_profiles.sort
    end

    it 'does not let randos read profiles' do
      resolved_profiles = UserConProfilePolicy::Scope.new(
        rando_profile.user, UserConProfile.all
      ).resolve

      assert_equal [rando_profile].sort, resolved_profiles.sort
    end
  end
end
