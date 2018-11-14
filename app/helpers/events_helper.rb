module EventsHelper
  def runs_section(event)
    app_component 'RunsSectionScaffold', eventId: event.id
  end
end
