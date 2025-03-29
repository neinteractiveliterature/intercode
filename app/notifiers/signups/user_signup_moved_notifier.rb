# frozen_string_literal: true
class Signups::UserSignupMovedNotifier < Notifier
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

  attr_reader :move_result
  delegate :signup, to: :move_result

  def initialize(move_result:)
    @move_result = move_result
    super(convention: signup.event.convention, event_key: "signups/user_signup_moved")
  end

  def liquid_assigns
    super.merge("signup" => signup, "move_result" => move_result)
  end

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :signup_user_con_profile)]
  end

  def sends_sms?
    true
  end
end
