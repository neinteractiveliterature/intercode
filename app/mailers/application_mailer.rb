class ApplicationMailer < ActionMailer::Base
  include AbsoluteUrls

  default(
    from: "intercode@#{Rails.application.config.action_mailer.default_url_options.try(:[], :host)}"
  )

  layout 'mailer'

  protected

  def use_convention_timezone(convention, &block)
    timezone = convention&.timezone

    if timezone
      Time.use_zone(timezone, &block)
    else
      yield
    end
  end

  def email_for_user_con_profile(user_con_profile)
    address = Mail::Address.new(user_con_profile.email)
    address.display_name = user_con_profile.name
    address.format
  end

  def emails_for_staff_position(staff_position)
    return [staff_position.email] if staff_position.email.present?
    staff_position.user_con_profiles.map { |ucp| email_for_user_con_profile(ucp) }
  end

  def emails_for_destinations(destinations)
    destinations.flat_map do |destination|
      case destination
      when UserConProfile then email_for_user_con_profile(destination)
      when StaffPosition then emails_for_staff_position(destination)
      when nil then []
      else raise InvalidArgument, "Don't know how to send email to a #{destination.class}"
      end
    end
  end

  def default_headers_from_notifier(notifier)
    {
      from: notifier.convention.email_from,
      to: emails_for_destinations(notifier.destinations)
    }
  end

  def notification_mail(notifier, options = {})
    use_convention_timezone(notifier.convention) do
      render_results = notifier.render

      mail(
        subject: render_results[:subject],
        **default_headers_from_notifier(notifier),
        **options
      ) do |format|
        format.html do
          @body_html = render_results[:body_html]
          render template: 'notifications/notification'
        end

        if render_results[:body_text].present?
          format.text do
            render plain: render_results[:body_text]
          end
        end
      end
    end
  end
end
