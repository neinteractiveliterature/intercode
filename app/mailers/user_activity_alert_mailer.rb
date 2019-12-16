class UserActivityAlertMailer < ApplicationMailer
  def alert(alert_user_con_profile, user_activity_alert, event)
    notification_mail(
      UserActivityAlerts::AlertNotifier.new(
        alert_user_con_profile: alert_user_con_profile,
        user_activity_alert: user_activity_alert,
        event: event
      )
    )
  end
end
