class UserActivityAlertMailer < ApplicationMailer
  def alert(alert_user_con_profile, destination_user_con_profile, user_activity_alert, event)
    @alert_user_con_profile = alert_user_con_profile
    @user_activity_alert = user_activity_alert
    @event = event

    event_short_description = case event.to_sym
    when :ticket_create then "#{user_activity_alert.convention.ticket_name.humanize} create"
    else event.to_s.humanize
    end

    use_convention_timezone(user_activity_alert.convention) do
      mail(
        from: from_address_for_convention(user_activity_alert.convention),
        to: "#{destination_user_con_profile.name_without_nickname} \
<#{destination_user_con_profile.email}>",
        subject: "[Alert] #{event_short_description}: #{alert_user_con_profile.name_without_nickname}"
      )
    end
  end
end
