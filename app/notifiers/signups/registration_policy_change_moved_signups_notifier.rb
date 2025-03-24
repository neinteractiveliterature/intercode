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

  def destinations
    team_members_to_notify_for_move_results(event, move_results).map(&:user_con_profile)
  end

  def default_destinations
    [:event_team_members]
  end

  def allowed_dynamic_destinations
    %i[event_team_members triggering_user]
  end

  def signups_by_id
    @signups_by_id ||= Signup.where(id: move_results.map(&:signup_id)).includes(:run).index_by(&:id)
  end

  def move_results_by_run
    @move_results_by_run ||= move_results.group_by { |move_result| signups_by_id[move_result.signup_id].run }
  end
end
