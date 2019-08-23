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
    staff_positions = StaffPosition.where(
      id: Permission.for_model(signup_request.convention)
        .where(permission: 'update_signups')
        .select(:staff_position_id)
    )

    emails_for_staff_positions(staff_positions)
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
