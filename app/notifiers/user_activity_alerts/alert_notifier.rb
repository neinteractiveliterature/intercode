class UserActivityAlerts::AlertNotifier < Notifier
  attr_reader :alert_user_con_profile, :user_activity_alert, :event

  def initialize(alert_user_con_profile:, user_activity_alert:, event:)
    @alert_user_con_profile = alert_user_con_profile
    @user_activity_alert = user_activity_alert
    @event = event
    super(convention: alert_user_con_profile.convention, event_key: 'user_activity_alerts/alert')
  end

  def liquid_assigns
    super.merge(
      'alert_user_con_profile' => alert_user_con_profile,
      'event_description' => event_description,
      'event_short_description' => event_short_description,
      'trigger_reasons' => trigger_reasons
    )
  end

  def destinations
    user_activity_alert.destination_user_con_profiles
  end

  def event_description
    case event.to_sym
    when :ticket_create then "purchased a #{alert_user_con_profile.ticket.ticket_type.description}"
    when :user_con_profile_create then 'created a profile'
    else event.to_s.humanize.downcase
    end
  end

  def event_short_description
    case event.to_sym
    when :ticket_create then "#{alert_user_con_profile.convention.ticket_name.humanize} create"
    else event.to_s.humanize
    end
  end

  def trigger_reasons
    [
      *(
        if user_activity_alert.matches_user?(alert_user_con_profile)
          ["Matched user account for #{user_activity_alert.user.name}"]
        else
          []
        end
      ),
      *(
        if user_activity_alert.matches_name?(alert_user_con_profile)
          ["Matched partial name '#{user_activity_alert.partial_name}'"]
        else
          []
        end
      ),
      *(
        if user_activity_alert.matches_email?(alert_user_con_profile)
          ["Matched email address '#{user_activity_alert.email}'"]
        else
          []
        end
      )
    ]
  end
end
