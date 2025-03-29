# frozen_string_literal: true
class SignupRequests::NewSignupRequestNotifier < Notifier
  attr_reader :signup_request

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

  def self.allowed_dynamic_destinations
    %i[triggering_user signup_request_user_con_profile]
  end

  def dynamic_destination_evaluators
    {
      signup_request_user_con_profile:
        Notifier::DynamicDestinations::SignupRequestUserConProfileEvaluator.new(notifier: self, signup_request:),
      triggering_user: Notifier::DynamicDestinations::TriggeringUserEvaluator.new(notifier: self)
    }
  end
end
