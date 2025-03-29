# frozen_string_literal: true
class Signups::WithdrawConfirmationNotifier < Notifier
  include Signups::SignupNotificationsHelper

  attr_reader :signup, :prev_state, :prev_bucket_key, :move_results

  def initialize(signup:, prev_state:, prev_bucket_key:)
    @signup = signup
    @prev_state = prev_state
    @prev_bucket_key = prev_bucket_key
    super(convention: signup.run.event.convention, event_key: "signups/withdraw_confirmation")
  end

  def liquid_assigns
    super.merge("signup" => signup, "prev_state" => prev_state, "prev_bucket" => prev_bucket)
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

  def prev_bucket
    return unless prev_bucket_key
    signup.run.event.registration_policy.bucket_with_key(prev_bucket_key)
  end
end
