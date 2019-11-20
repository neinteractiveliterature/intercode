class EventRunsLoader < GraphQL::Batch::Loader
  attr_reader :start, :finish, :exclude_conflicts_for_user_con_profile, :pundit_user

  def initialize(start, finish, exclude_conflicts_for_user_con_profile, pundit_user)
    @start = start
    @finish = finish
    @exclude_conflicts_for_user_con_profile = exclude_conflicts_for_user_con_profile
    @pundit_user = pundit_user
  end

  def perform(keys)
    run_scope = Run.includes(event: [:convention]).where(event_id: keys.map(&:id))
    run_scope = run_scope.where('runs.starts_at >= ?', start) if start
    run_scope = run_scope.where('runs.starts_at < ?', finish) if finish

    runs_by_event_id = run_scope.to_a.group_by(&:event_id)
    # if I can read one run I can read any run
    return [] unless RunPolicy.new(pundit_user, run_scope.first).read?

    keys.each do |event|
      fulfill(event, runs_by_event_id[event.id] || [])
    end
  end
end
