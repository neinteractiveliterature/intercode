class SignupRequests::NewSignupRequestNotifier < Notifier
  attr_reader :signup_request

  def initialize(signup_request:, timezone:)
    @signup_request = signup_request
    super(
      convention: signup_request.target_run.event.convention,
      event_key: 'signup_requests/new_signup_request'
    )
  end

  def liquid_assigns
    super.merge('signup_request' => signup_request)
  end

  def destinations
    StaffPosition.where(
      id: Permission.for_model(signup_request.convention)
        .where(permission: 'update_signups')
        .select(:staff_position_id)
    )
  end
end
