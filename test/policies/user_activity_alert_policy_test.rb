require 'test_helper'
require_relative 'convention_permissions_test_helper'

class UserActivityAlertPolicyTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:user_activity_alert) { create(:user_activity_alert) }
  let(:convention) { user_activity_alert.convention }

  %w[read manage].each do |action|
    describe "##{action}?" do
      it "lets users with update_user_activity_alerts #{action} user activity alerts" do
        user = create_user_with_update_user_activity_alerts_in_convention(convention)
        assert UserActivityAlertPolicy.new(user, user_activity_alert).read?
      end

      it "does not let users with update_user_activity_alerts #{action} user activity alerts \
from other conventions" do
        user = create_user_with_update_user_activity_alerts_in_convention(create(:convention))
        refute UserActivityAlertPolicy.new(user, user_activity_alert).read?
      end

      it "does not let anyone else #{action} user activity alerts" do
        user_con_profile = create(:user_con_profile, convention: convention)
        refute UserActivityAlertPolicy.new(user_con_profile.user, user_activity_alert).read?
      end
    end
  end

  describe 'Scope' do
    it 'returns all user activity alerts to users with update_user_activity_alerts' do
      user = create_user_with_update_user_activity_alerts_in_convention(convention)
      resolved_alerts = UserActivityAlertPolicy::Scope.new(user, UserActivityAlert.all).resolve

      assert_equal [user_activity_alert], resolved_alerts.sort
    end

    it 'does not return user activity alerts to staff of other conventions' do
      user_activity_alert
      user = create_user_with_update_user_activity_alerts_in_convention(create(:convention))
      resolved_alerts = UserActivityAlertPolicy::Scope.new(user, UserActivityAlert.all).resolve

      assert_equal [], resolved_alerts.sort
    end

    it 'returns nothing to anyone else' do
      user_activity_alert
      user_con_profile = create(:user_con_profile, convention: convention)
      resolved_alerts = UserActivityAlertPolicy::Scope.new(
        user_con_profile.user, UserActivityAlert.all
      ).resolve

      assert_equal [], resolved_alerts.sort
    end
  end
end
