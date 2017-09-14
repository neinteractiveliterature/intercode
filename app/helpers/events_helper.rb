module EventsHelper
  def schedule_grid(config = {})
    react_component(
      "ScheduleGrid",
      authenticityToken: graphql_authenticity_token,
      basename: url_for(params.permit!.to_h.merge(extra: nil, only_path: true)),
      config: config
    )
  end
end
