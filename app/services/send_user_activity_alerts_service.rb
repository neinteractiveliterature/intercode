class SendUserActivityAlertsService < CivilService::Service
  attr_reader :user_con_profile, :event

  def initialize(user_con_profile:, event:)
    @user_con_profile = user_con_profile
    @event = event
  end

  private

  def inner_call
    triggered_alerts.each do |alert|
      UserActivityAlerts::AlertNotifier.new(
        user_con_profile: user_con_profile,
        user_activity_alert: alert,
        event: event
      ).deliver_later
    end

    success
  end

  def triggered_alerts
    user_con_profile.convention.user_activity_alerts.select do |user_activity_alert|
      user_activity_alert.trigger?(event, user_con_profile)
    end
  end
end
