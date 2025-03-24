# frozen_string_literal: true
class Signups::UserSignupMovedNotifier < Notifier
  attr_reader :move_result
  delegate :signup, to: :move_result

  def initialize(move_result:)
    @move_result = move_result
    super(convention: signup.event.convention, event_key: "signups/user_signup_moved")
  end

  def liquid_assigns
    super.merge("signup" => signup, "move_result" => move_result)
  end

  def destinations
    [signup.user_con_profile]
  end

  def self.default_destinations(**)
    [:signup_user_con_profile]
  end

  def self.allowed_dynamic_destinations
    %i[signup_user_con_profile event_team_members triggering_user]
  end

  def sends_sms?
    true
  end
end
