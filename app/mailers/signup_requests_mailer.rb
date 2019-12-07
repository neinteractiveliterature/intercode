class SignupRequestsMailer < ApplicationMailer
  def new_signup_request(signup_request)
    notification_template_mail(
      signup_request.convention,
      'signup_requests/new_signup_request',
      { 'signup_request' => signup_request },
      from: from_address_for_convention(signup_request.convention),
      to: signup_moderators_mail_destination(signup_request)
    )
  end

  def request_accepted(signup_request)
    notification_template_mail(
      signup_request.convention,
      'signup_requests/request_accepted',
      { 'signup_request' => signup_request },
      from: from_address_for_convention(signup_request.convention),
      to: signup_request.user_con_profile.email
    )
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
end
