# frozen_string_literal: true
class SignupRequests::NewSignupRequestNotifier < Notifier
  attr_reader :signup_request

  dynamic_destination :signup_request_user_con_profile do
    { signup_request: }
  end
  dynamic_destination :triggering_user
  condition :event_category do
    { event_category: signup_request.target_run.event.event_category }
  end

  def initialize(signup_request:)
    @signup_request = signup_request
    super(convention: signup_request.target_run.event.convention, event_key: "signup_requests/new_signup_request")
  end

  def liquid_assigns
    super.merge("signup_request" => signup_request)
  end

  def self.build_default_destinations(notification_template:)
    StaffPosition
      .where(
        id:
          Permission
            .for_model(notification_template.convention)
            .where(permission: "update_signups")
            .select(:staff_position_id)
      )
      .map { |staff_position| notification_template.notification_destinations.new(staff_position:) }
  end
end
