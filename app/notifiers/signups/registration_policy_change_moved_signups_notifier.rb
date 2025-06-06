# frozen_string_literal: true
class Signups::RegistrationPolicyChangeMovedSignupsNotifier < Notifier
  attr_reader :event, :move_results, :whodunit

  dynamic_destination :event_team_members do
    no_confirmed_moves =
      move_results.none? { |move_result| move_result.prev_state == "confirmed" || move_result.state == "confirmed" }

    { signup_state: no_confirmed_moves ? "waitlisted" : "confirmed", event: }
  end
  dynamic_destination :triggering_user
  condition :event_category do
    { event_category: signup.run.event.event_category }
  end

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

  def signups_by_id
    @signups_by_id ||= Signup.where(id: move_results.map(&:signup_id)).includes(:run).index_by(&:id)
  end

  def move_results_by_run
    @move_results_by_run ||= move_results.group_by { |move_result| signups_by_id[move_result.signup_id].run }
  end
end
