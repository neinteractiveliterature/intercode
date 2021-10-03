# frozen_string_literal: true
class EventRunsLoader < GraphQL::Batch::Loader
  attr_reader :start, :finish, :exclude_conflicts_for_user_con_profile, :pundit_user

  def initialize(start, finish, exclude_conflicts_for_user_con_profile, pundit_user)
    @start = start
    @finish = finish
    @exclude_conflicts_for_user_con_profile = exclude_conflicts_for_user_con_profile
    @pundit_user = pundit_user
  end

  def perform(keys)
    run_scope = Run.includes(event: [:convention]).where(event_id: keys.map(&:id)).between(start, finish)

    runs_by_event_id = run_scope.to_a.group_by(&:event_id)
    if can_read_runs?(runs_by_event_id)
      keys.each { |event| fulfill(event, runs_by_event_id[event.id] || []) }
    else
      keys.each { |event| fulfill(event, []) }
    end
  end

  private

  def can_read_runs?(runs_by_event_id)
    # if I can read one run I can read any run
    runs_by_event_id.present? && RunPolicy.new(pundit_user, runs_by_event_id.values.first.first).read?
  end
end
