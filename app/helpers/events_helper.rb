module EventsHelper
  def schedule_grid(config = {})
    react_component(
      'ScheduleGrid',
      authenticityToken: graphql_authenticity_token,
      basename: url_for(params.permit!.to_h.merge(extra: nil, only_path: true)),
      config: config
    )
  end

  def signup_button(event, run, signup_option)
    url = event_run_user_signup_path(event, run, signup_option.params)

    link_to url, method: 'POST', class: "btn mx-1 mb-2 #{signup_option.button_class}" do
      safe_join([
        content_tag(:strong, 'Sign up'),
        *(signup_option.label.present? ? [tag(:br), signup_option.label] : [])
      ])
    end
  end
end
