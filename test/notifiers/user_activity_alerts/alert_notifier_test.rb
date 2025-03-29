require "test_helper"

class UserActivityAlerts::AlertNotifierTest < ActiveSupport::TestCase
  describe "destinations" do
    let(:convention) { create(:convention, :with_notification_templates) }
    let(:user_activity_alert) { create(:user_activity_alert) }

    it "figures out the destinations correctly" do
      staff_member = create(:user_con_profile, convention: convention)
      staff_position = create(:staff_position, convention: convention, user_con_profiles: [staff_member])
      other_user_con_profile = create(:user_con_profile, convention: convention)
      user_activity_alert.notification_destinations.create!(staff_position: staff_position)
      user_activity_alert.notification_destinations.create!(user_con_profile: other_user_con_profile)

      notifier =
        UserActivityAlerts::AlertNotifier.new(
          alert_user_con_profile: other_user_con_profile,
          event: :user_con_profile_create,
          user_activity_alert: user_activity_alert
        )

      assert_equal([staff_member, other_user_con_profile].sort, notifier.destination_user_con_profiles.sort)
    end
  end
end
