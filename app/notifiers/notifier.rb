class Notifier
  attr_reader :event_key, :convention

  def initialize(convention:, event_key:)
    @convention = convention
    @event_key = event_key
  end

  def render(cadmus_renderer)
    notification_template = convention.notification_templates.find_by!(event_key: event_key)

    {
      subject: notification_template.subject_template,
      body_html: notification_template.body_html_template,
      body_text: notification_template.body_text_template
    }.transform_values do |template|
      cadmus_renderer.render(template, :html, assigns: liquid_assigns)
    end
  end

  def liquid_assigns
    { 'convention' => convention }
  end

  def destinations
    raise NotImplementedError, 'Notifier subclasses must implement #destinations'
  end
end
