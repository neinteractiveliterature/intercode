class ApplicationMailer < ActionMailer::Base
  include AbsoluteUrls

  default(
    from: "intercode@#{Rails.application.config.action_mailer.default_url_options.try(:[], :host)}"
  )

  layout 'mailer'

  protected

  def from_address_for_convention(convention)
    address = Mail::Address.new("noreply@#{convention.domain}")
    address.display_name = convention.name
    address.format
  end

  def use_convention_timezone(convention, &block)
    timezone = convention&.timezone

    if timezone
      Time.use_zone(timezone, &block)
    else
      yield
    end
  end

  def emails_for_staff_positions(staff_positions)
    staff_positions.flat_map do |staff_position|
      staff_position.email.presence || staff_position.user_con_profiles.map do |user_con_profile|
        address = Mail::Address.new(user_con_profile.email)
        address.display_name = user_con_profile.name
        address.format
      end
    end
  end

  def cms_rendering_context(convention, assigns)
    CmsRenderingContext.new(
      cms_parent: convention,
      controller: self,
      assigns: {
        'convention' => convention
      }.merge(assigns)
    )
  end

  def notification_template_mail(convention, event_key, liquid_assigns, options = {})
    use_convention_timezone(convention) do
      notification_template = convention.notification_templates.find_by!(event_key: event_key)
      rendering_context = cms_rendering_context(convention, liquid_assigns)

      subject = rendering_context.cadmus_renderer.render(
        notification_template.subject_template, :html
      )
      @body_html = rendering_context.cadmus_renderer.render(
        notification_template.body_html_template, :html
      )
      @body_text = rendering_context.cadmus_renderer.render(
        notification_template.body_text_template, :html # ya rly
      )

      mail(options.merge(
        subject: subject, template_path: 'notifications', template_name: 'notification'
      ))
    end
  end
end
