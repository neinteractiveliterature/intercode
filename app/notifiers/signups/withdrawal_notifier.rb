# frozen_string_literal: true
class Signups::WithdrawalNotifier < Notifier
  include Signups::SignupNotificationsHelper

  attr_reader :signup, :prev_state, :prev_bucket_key, :move_results

  def initialize(signup:, prev_state:, prev_bucket_key:, move_results:)
    @signup = signup
    @prev_state = prev_state
    @prev_bucket_key = prev_bucket_key
    @move_results = move_results
    super(convention: signup.run.event.convention, event_key: "signups/withdrawal")
  end

  def liquid_assigns
    super.merge(
      "signup" => signup,
      "prev_state" => prev_state,
      "prev_bucket" => prev_bucket,
      "move_results" => move_results
    )
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

  def prev_bucket
    return unless prev_bucket_key
    signup.run.event.registration_policy.bucket_with_key(prev_bucket_key)
  end

  def sends_sms?
    true
  end
end
