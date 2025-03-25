# frozen_string_literal: true
class Signups::NewSignupNotifier < Notifier
  include Signups::SignupNotificationsHelper

  attr_reader :signup

  def initialize(signup:)
    @signup = signup
    super(convention: signup.run.event.convention, event_key: "signups/new_signup")
  end

  def liquid_assigns
    super.merge("signup" => signup)
  end

  def destinations
    team_members_to_notify_for_signup(signup).map(&:user_con_profile)
  end

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :event_team_members)]
  end

  def self.allowed_dynamic_destinations
    %i[signup_user_con_profile event_team_members triggering_user]
  end

  def sends_sms?
    true
  end
end
