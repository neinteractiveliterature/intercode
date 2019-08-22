require 'test_helper'
require_relative 'convention_permissions_test_helper'

class SignupPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:signup) { create(:signup) }
  let(:convention) { signup.run.event.convention }

  describe '#read?' do
    it 'lets users with read_signup_details read signups' do
      user = create_user_with_read_signup_details_in_convention(convention)
      assert SignupPolicy.new(user, signup).read?
    end

    it 'lets team members read signups in their events' do
      team_member = create(:team_member, event: signup.run.event)
      assert SignupPolicy.new(team_member.user_con_profile.user, signup).read?
    end

    it 'lets users read their own signups' do
      assert SignupPolicy.new(signup.user_con_profile.user, signup).read?
    end

    it 'lets users read signups of other attendees of the same run' do
      my_signup = create(:signup, run: signup.run)
      assert SignupPolicy.new(my_signup.user_con_profile.user, signup).read?
    end

    it 'does not let users read signups of other attendees of the same run if private_signup_list is set' do
      signup.run.event.update!(private_signup_list: true)
      my_signup = create(:signup, run: signup.run)
      refute SignupPolicy.new(my_signup.user_con_profile.user, signup).read?
    end

    it "does not let users read other users' signups" do
      refute SignupPolicy.new(create(:user), signup).read?
    end
  end

  describe '#read_requested_bucket_key?' do
    it 'lets users with read_signup_details read requested bucket key for signups in the con' do
      user = create_user_with_read_signup_details_in_convention(convention)
      assert SignupPolicy.new(user, signup).read_requested_bucket_key?
    end

    it 'lets team members read requested bucket key for signups in their events' do
      team_member = create(:team_member, event: signup.run.event)
      assert SignupPolicy.new(team_member.user_con_profile.user, signup).read_requested_bucket_key?
    end

    it 'lets users read requested bucket key for their own signups' do
      assert SignupPolicy.new(signup.user_con_profile.user, signup).read_requested_bucket_key?
    end

    it 'does not let users read requested bucket key of other attendes of the same run' do
      my_signup = create(:signup, run: signup.run)
      refute SignupPolicy.new(my_signup.user_con_profile.user, signup).read_requested_bucket_key?
    end

    it "does not let users read requested bucket key for other users' signups" do
      refute SignupPolicy.new(create(:user), signup).read_requested_bucket_key?
    end
  end

  describe '#create?' do
    it 'lets any user create signups' do
      # For better UX, the signup mode check is done in EventSignupService
      assert SignupPolicy.new(signup.user_con_profile.user, Signup.new(run: signup.run)).create?
    end
  end

  describe '#withdraw?' do
    it 'lets a user withdraw their own signups' do
      assert SignupPolicy.new(signup.user_con_profile.user, signup).withdraw?
    end

    it "does not let a user withdraw other users' signups" do
      refute SignupPolicy.new(create(:user), signup).withdraw?
    end

    it 'lets users with update_signups withdraw signups in moderated signup conventions' do
      convention.update!(signup_mode: 'moderated')
      user = create_user_with_update_signups_in_convention(convention)
      assert SignupPolicy.new(user, signup).withdraw?
    end

    it 'does not let users with update_signups withdraw signups in self-service signup conventions' do
      convention.update!(signup_mode: 'self_service')
      user = create_user_with_update_signups_in_convention(convention)
      refute SignupPolicy.new(user, signup).withdraw?
    end
  end

  describe '#manage?' do
    it 'lets users with update_signups manage signups in moderated conventions' do
      convention.update!(signup_mode: 'moderated')
      user = create_user_with_update_signups_in_convention(convention)
      assert SignupPolicy.new(user, signup).manage?
    end

    it 'does not let users with update_signups manage signups in self-service conventions' do
      convention.update!(signup_mode: 'self_service')
      user = create_user_with_update_signups_in_convention(convention)
      refute SignupPolicy.new(user, signup).manage?
    end

    it 'does not let users with only read_signup_details manage signups' do
      user = create_user_with_read_signup_details_in_convention(convention)
      refute SignupPolicy.new(user, signup).manage?
    end

    it 'does not let team members manage signups in their events' do
      team_member = create(:team_member, event: signup.run.event)
      refute SignupPolicy.new(team_member.user_con_profile.user, signup).manage?
    end

    it 'does not let users manage their own signups' do
      refute SignupPolicy.new(signup.user_con_profile.user, signup).manage?
    end
  end

  %w[update_bucket force_confirm update_counted].each do |action|
    it "lets team members #{action} signups in their events" do
      team_member = create(:team_member, event: signup.run.event)
      assert SignupPolicy.new(team_member.user_con_profile.user, signup).public_send("#{action}?")
    end

    it "does not let users #{action} their own signups" do
      refute SignupPolicy.new(signup.user_con_profile.user, signup).public_send("#{action}?")
    end
  end

  describe 'Scope' do
    it 'return signups in cons where the user has read_signup_details' do
      user = create_user_with_read_signup_details_in_convention(convention)
      resolved_signups = SignupPolicy::Scope.new(user, Signup.all).resolve

      assert_equal [signup], resolved_signups.sort
    end

    it 'returns signups for events where you are a team member' do
      team_member = create(:team_member, event: signup.run.event)
      resolved_signups = SignupPolicy::Scope.new(
        team_member.user_con_profile.user, Signup.all
      ).resolve

      assert_equal [signup], resolved_signups.sort
    end

    it 'returns your own signups' do
      resolved_signups = SignupPolicy::Scope.new(signup.user_con_profile.user, Signup.all).resolve
      assert_equal [signup], resolved_signups.sort
    end

    it 'returns signups of other attendees of the same run' do
      my_signup = create(:signup, run: signup.run)
      resolved_signups = SignupPolicy::Scope.new(
        my_signup.user_con_profile.user, Signup.all
      ).resolve
      assert_equal [my_signup, signup].sort, resolved_signups.sort
    end

    it 'does not return signups of other attendees of the same run if private_signup_list is set' do
      signup.run.event.update!(private_signup_list: true)
      my_signup = create(:signup, run: signup.run)
      resolved_signups = SignupPolicy::Scope.new(
        my_signup.user_con_profile.user, Signup.all
      ).resolve
      assert_equal [my_signup].sort, resolved_signups.sort
    end

    it 'returns no signups by default' do
      resolved_signups = SignupPolicy::Scope.new(create(:user), Signup.all).resolve
      assert_equal [], resolved_signups.sort
    end
  end
end
