require 'test_helper'
require_relative 'convention_permissions_test_helper'

class SignupRequestPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention, :with_notification_templates) }
  let(:event) { create(:event, convention: convention) }
  let(:target_run) { create(:run, event: event) }
  let(:signup_request) { create(:signup_request, target_run: target_run) }

  describe '#read?' do
    it 'lets users with update_signups read signup requests in a moderated-signup convention' do
      convention.update!(signup_mode: 'moderated')
      user = create_user_with_update_signups_in_convention(convention)

      assert SignupRequestPolicy.new(user, signup_request).read?
    end

    it 'does not let users with update_signups read signup requests in a self-service signup convention' do
      convention.update!(signup_mode: 'self_service')
      user = create_user_with_update_signups_in_convention(convention)

      refute SignupRequestPolicy.new(user, signup_request).read?
    end

    it 'lets users read their own signup requests' do
      assert SignupRequestPolicy.new(signup_request.user_con_profile.user, signup_request).read?
    end

    it "does not let users read other people's signup requests" do
      refute SignupRequestPolicy.new(create(:user), signup_request).read?
    end
  end

  %w[accept reject manage].each do |action|
    describe "##{action}?" do
      it "lets users with update_signups #{action} signup requests in a moderated-signup convention" do
        convention.update!(signup_mode: 'moderated')
        user = create_user_with_update_signups_in_convention(convention)

        assert SignupRequestPolicy.new(user, signup_request).public_send("#{action}?")
      end

      it "does not let users with update_signups #{action} signup requests in a self-service signup convention" do
        convention.update!(signup_mode: 'self_service')
        user = create_user_with_update_signups_in_convention(convention)

        refute SignupRequestPolicy.new(user, signup_request).public_send("#{action}?")
      end

      it "does not let users #{action} their own signup requests" do
        refute SignupRequestPolicy.new(signup_request.user_con_profile.user, signup_request)
          .public_send("#{action}?")
      end

      it "does not let users #{action} other people's signup requests" do
        refute SignupRequestPolicy.new(create(:user), signup_request).public_send("#{action}?")
      end
    end
  end

  describe '#create?' do
    it 'lets users create signup requests in a moderated-signup convention' do
      user_con_profile = create(:user_con_profile, convention: convention)
      convention.update!(signup_mode: 'moderated')
      new_signup_request = SignupRequest.new(
        target_run: signup_request.target_run, user_con_profile: user_con_profile
      )
      assert SignupRequestPolicy.new(user_con_profile.user, new_signup_request).create?
    end

    it 'does not let users create signup requests in a self-service signup convention' do
      user_con_profile = create(:user_con_profile, convention: convention)
      convention.update!(signup_mode: 'self_service')
      new_signup_request = SignupRequest.new(
        target_run: signup_request.target_run, user_con_profile: user_con_profile
      )
      refute SignupRequestPolicy.new(user_con_profile.user, new_signup_request).create?
    end

    it 'does not let users create signup requests for other users' do
      user_con_profile = create(:user_con_profile, convention: convention)
      convention.update!(signup_mode: 'moderated')
      new_signup_request = SignupRequest.new(
        target_run: signup_request.target_run,
        user_con_profile: create(:user_con_profile, convention: convention)
      )
      refute SignupRequestPolicy.new(user_con_profile.user, new_signup_request).create?
    end
  end

  describe '#withdraw?' do
    it 'lets users withdraw their own pending signup requests' do
      assert SignupRequestPolicy.new(signup_request.user_con_profile.user, signup_request).withdraw?
    end

    it 'does not let users withdraw their own rejected signup requests' do
      signup_request.update!(state: 'rejected')
      refute SignupRequestPolicy.new(
        signup_request.user_con_profile.user, signup_request
      ).withdraw?
    end

    it 'does not let users withdraw their own accepted signup requests' do
      AcceptSignupRequestService.new(signup_request: signup_request, whodunit: create(:user)).call!
      refute SignupRequestPolicy.new(
        signup_request.user_con_profile.user, signup_request
      ).withdraw?
    end

    it "does not let users withdraw other people's pending signup requests" do
      refute SignupRequestPolicy.new(create(:user), signup_request).withdraw?
    end
  end

  describe 'Scope' do
    it 'returns all signup requests in moderated-signup cons where you have update_signups' do
      convention.update!(signup_mode: 'moderated')
      user = create_user_with_update_signups_in_convention(convention)
      resolved_signup_requests = SignupRequestPolicy::Scope.new(user, SignupRequest.all).resolve

      assert_equal [signup_request], resolved_signup_requests.sort
    end

    it "returns a regular user's own signup requests" do
      # create another signup request in the same con just to show we don't return it
      create(:signup_request, target_run: signup_request.target_run)
      resolved_signup_requests = SignupRequestPolicy::Scope.new(
        signup_request.user_con_profile.user, SignupRequest.all
      ).resolve

      assert_equal [signup_request], resolved_signup_requests.sort
    end
  end
end
