# frozen_string_literal: true
class Signups::NewSignupNotifier < Notifier
  dynamic_destination :event_team_members do
    { signup_state: signup.state, event: signup.run.event }
  end
  dynamic_destination :signup_user_con_profile do
    { signup: signup }
  end
  dynamic_destination :triggering_user
  condition :event_category do
    { event_category: signup.run.event.event_category }
  end

  attr_reader :signup

  def initialize(signup:)
    @signup = signup
    super(convention: signup.run.event.convention, event_key: "signups/new_signup")
  end

  def liquid_assigns
    super.merge("signup" => signup)
  end

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :event_team_members)]
  end

  def sends_sms?
    true
  end
end
