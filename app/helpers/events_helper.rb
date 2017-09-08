module EventsHelper
  def schedule_grid(classify_events_by: nil, show_signed_up: false, show_signup_status_badge: false)
    react_component(
      "ScheduleGrid",
      authenticityToken: form_authenticity_token(form_options: { action: graphql_path, method: 'POST' }),
      classifyEventsBy: classify_events_by,
      showSignedUp: show_signed_up,
      showSignupStatusBadge: show_signup_status_badge
    )
  end
end
