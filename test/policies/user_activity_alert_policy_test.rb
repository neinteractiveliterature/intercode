require 'test_helper'

class UserActivityAlertPolicyTest < ActiveSupport::TestCase
  let(:user_activity_alert) { create(:user_activity_alert) }
  let(:convention) { user_activity_alert.convention }

  %w[read manage].each do |action|
    describe "##{action}?" do
      it "lets con staff #{action} user activity alerts" do
        user_con_profile = create(:staff_user_con_profile, convention: convention)
        assert UserActivityAlertPolicy.new(user_con_profile.user, user_activity_alert).read?
      end

      it "does not let con staff #{action} user activity alerts from other conventions" do
        user_con_profile = create(:staff_user_con_profile)
        refute UserActivityAlertPolicy.new(user_con_profile.user, user_activity_alert).read?
      end

      it "does not let anyone else #{action} user activity alerts" do
        user_con_profile = create(:user_con_profile, convention: convention)
        refute UserActivityAlertPolicy.new(user_con_profile.user, user_activity_alert).read?
      end
    end
  end

  describe 'Scope' do
    it 'returns all user activity alerts to con staff' do
      user_con_profile = create(:staff_user_con_profile, convention: convention)
      resolved_alerts = UserActivityAlertPolicy::Scope.new(
        user_con_profile.user, UserActivityAlert.all
      ).resolve

      assert_equal [user_activity_alert], resolved_alerts.sort
    end

    it 'does not return user activity alerts to staff of other conventions' do
      user_activity_alert
      user_con_profile = create(:staff_user_con_profile)
      resolved_alerts = UserActivityAlertPolicy::Scope.new(
        user_con_profile.user, UserActivityAlert.all
      ).resolve

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
