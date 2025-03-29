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

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :signup_user_con_profile)]
  end

  def self.allowed_dynamic_destinations
    %i[signup_user_con_profile event_team_members]
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
        )
    }
  end

  def self.allowed_conditions
    [:event_category]
  end

  def condition_evaluators
    {
      event_category:
        Notifier::Conditions::EventCategoryEvaluator.new(
          notifier: self,
          event_category: signup.run.event.event_category
        )
    }
  end
end
