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

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :signup_user_con_profile)]
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

  def sends_sms?
    true
  end
end
