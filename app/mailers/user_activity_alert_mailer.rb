class UserActivityAlertMailer < ApplicationMailer
  def alert(alert_user_con_profile, destination_user_con_profile, user_activity_alert, event)
    notification_template_mail(
      alert_user_con_profile.convention,
      'user_activity_alerts/alert',
      {
        'alert_user_con_profile' => alert_user_con_profile,
        'event_description' => event_description(event, alert_user_con_profile),
        'event_short_description' => event_short_description(event, alert_user_con_profile),
        'trigger_reasons' => trigger_reasons(user_activity_alert, alert_user_con_profile)
      },
      from: from_address_for_convention(alert_user_con_profile.convention),
      to: "#{destination_user_con_profile.name_without_nickname} \
<#{destination_user_con_profile.email}>"
    )
  end

  private

  def event_description(event, alert_user_con_profile)
    case event.to_sym
    when :ticket_create then "purchased a #{alert_user_con_profile.ticket.ticket_type.description}"
    when :user_con_profile_create then 'created a profile'
    else event.to_s.humanize.downcase
    end
  end

  def event_short_description(event, alert_user_con_profile)
    case event.to_sym
    when :ticket_create then "#{alert_user_con_profile.convention.ticket_name.humanize} create"
    else event.to_s.humanize
    end
  end

  def trigger_reasons(user_activity_alert, user_con_profile)
    [
      *(
        if user_activity_alert.matches_user?(user_con_profile)
          ["Matched user account for #{user_activity_alert.user.name}"]
        else
          []
        end
      ),
      *(
        if user_activity_alert.matches_name?(user_con_profile)
          ["Matched partial name '#{user_activity_alert.partial_name}'"]
        else
          []
        end
      ),
      *(
        if user_activity_alert.matches_email?(user_con_profile)
          ["Matched email address '#{user_activity_alert.email}'"]
        else
          []
        end
      )
    ]
  end
end
