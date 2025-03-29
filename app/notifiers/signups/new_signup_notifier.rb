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

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :event_team_members)]
  end

  def self.allowed_dynamic_destinations
    %i[signup_user_con_profile event_team_members triggering_user]
  end

  def dynamic_destination_evaluators
    {
      signup_user_con_profile:
        Notifier::DynamicDestinations::SignupUserConProfileEvaluator.new(notifier: self, signup:),
      event_team_members:
        Notifier::DynamicDestinations::EventTeamMembersEvaluator.new(
          notifier: self,
          signup_state: signup.state,
          event: signup.run.event
        ),
      triggering_user: Notifier::DynamicDestinations::TriggeringUserEvaluator.new(notifier: self)
    }
  end

  def sends_sms?
    true
  end
end
