# frozen_string_literal: true
class Signups::RegistrationPolicyChangeMovedSignupsNotifier < Notifier
  include Signups::SignupNotificationsHelper

  attr_reader :event, :move_results, :whodunit

  def initialize(event:, move_results:, whodunit:)
    @event = event
    @move_results = move_results
    @whodunit = whodunit
    super(convention: event.convention, event_key: "signups/registration_policy_change_moved_signups")
  end

  def liquid_assigns
    super.merge(
      "event" => event,
      "whodunit" => whodunit,
      "move_results_by_run_id" => move_results_by_run.transform_keys(&:id),
      "runs" => move_results_by_run.keys.sort_by(&:starts_at)
    )
  end

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :event_team_members)]
  end

  def self.allowed_dynamic_destinations
    %i[event_team_members triggering_user]
  end

  def dynamic_destination_evaluators
    {
      event_team_members:
        Notifier::DynamicDestinations::EventTeamMembersEvaluator.new(notifier: self, signup_state: "confirmed", event:),
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

  def signups_by_id
    @signups_by_id ||= Signup.where(id: move_results.map(&:signup_id)).includes(:run).index_by(&:id)
  end

  def move_results_by_run
    @move_results_by_run ||= move_results.group_by { |move_result| signups_by_id[move_result.signup_id].run }
  end
end
