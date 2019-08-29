class ApplicationMailer < ActionMailer::Base
  include Concerns::AbsoluteUrls

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
end
