# frozen_string_literal: true
class Signups::HoldExpiredNotifier < Notifier
  attr_reader :signup

  def initialize(signup:)
    @signup = signup
    super(convention: signup.run.event.convention, event_key: "signups/hold_expired")
  end

  def liquid_assigns
    super.merge("signup" => signup)
  end

  def destinations
    [signup.user_con_profile]
  end

  def default_destinations
    [:signup_user_con_profile]
  end

  def allowed_dynamic_destinations
    %i[signup_user_con_profile event_team_members]
  end
end
