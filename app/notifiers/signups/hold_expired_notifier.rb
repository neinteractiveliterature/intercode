# frozen_string_literal: true
class Signups::HoldExpiredNotifier < Notifier
  attr_reader :signup

  dynamic_destination :event_team_members do
    { signup_state: signup.state, event: signup.run.event }
  end
  dynamic_destination :signup_user_con_profile do
    { signup: signup }
  end
  condition :event_category do
    { event_category: signup.run.event.event_category }
  end

  def initialize(signup:)
    @signup = signup
    super(convention: signup.run.event.convention, event_key: "signups/hold_expired")
  end

  def liquid_assigns
    super.merge("signup" => signup)
  end

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :signup_user_con_profile)]
  end
end
