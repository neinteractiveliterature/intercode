class EventRunsLoader < GraphQL::Batch::Loader
  attr_reader :start, :finish, :pundit_user

  def initialize(start, finish, pundit_user)
    @start = start
    @finish = finish
    @pundit_user = pundit_user
  end

  def perform(keys)
    run_scope = RunPolicy::Scope.new(
      pundit_user,
      Run.includes(:event).where(event_id: keys.map(&:id))
    ).resolve
    run_scope = run_scope.where('runs.starts_at >= ?', start) if start
    run_scope = run_scope.where('runs.starts_at < ?', finish) if finish

    runs_by_event_id = run_scope.to_a.group_by(&:event_id)
    keys.each do |event|
      fulfill(event, runs_by_event_id[event.id] || [])
    end
  end
end
