class SignupRequestsMailer < ApplicationMailer
  def new_signup_request(signup_request)
    @signup_request = signup_request
    use_convention_timezone(@signup_request.convention) do
      signup_request_mail(signup_request, "New request from #{signup_request.user_con_profile.name}")
    end
  end

  def request_accepted(signup_request)
    @signup_request = signup_request
    use_convention_timezone(@signup_request.convention) do
      mail(
        from: from_address_for_convention(signup_request.convention),
        to: signup_request.user_con_profile.email,
        subject: "#{subject_prefix(signup_request)} Request accepted: #{signup_request.target_run.event.title}"
      )
    end
  end

  private

  def signup_moderators_mail_destination(signup_request)
    users_with_priv = signup_request.convention.user_con_profiles.where(staff: true).to_a

    users_with_priv.map do |user_con_profile|
      "#{user_con_profile.name} <#{user_con_profile.email}>"
    end
  end

  def subject_prefix(signup_request)
    "[#{signup_request.convention.name}: Signup Moderation]"
  end

  def signup_request_mail(signup_request, subject)
    mail(
      from: from_address_for_convention(signup_request.convention),
      to: signup_moderators_mail_destination(signup_request),
      subject: "#{subject_prefix(signup_request)} #{subject}"
    )
  end

  def signup_moderation_url_for_convention(signup_request)
    url_with_convention_host('/signup_moderation', signup_request.convention)
  end
  helper_method :signup_moderation_url_for_convention
end
