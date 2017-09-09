module EventsHelper
  def schedule_grid(config = {})
    react_component(
      "ScheduleGrid",
      authenticityToken: form_authenticity_token(form_options: { action: graphql_path, method: 'POST' }),
      basename: url_for(params.permit!.to_h.merge(extra: nil, only_path: true)),
      config: config
    )
  end
end
