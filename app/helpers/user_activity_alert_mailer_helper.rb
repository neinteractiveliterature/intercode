module UserActivityAlertMailerHelper
  def event_description(event, alert_user_con_profile)
    case event.to_sym
    when :ticket_create then "purchased a #{alert_user_con_profile.ticket.ticket_type.description}"
    when :user_con_profile_create then 'created a profile'
    else event.to_s.humanize.downcase
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
