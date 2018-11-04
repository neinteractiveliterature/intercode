class EventRunsLoader < GraphQL::Batch::Loader
  attr_reader :start, :finish

  def initialize(start, finish)
    @start = start
    @finish = finish
  end

  def perform(keys)
    run_scope = Run.includes(:event).where(event_id: keys.map(&:id))
    run_scope = run_scope.where('starts_at >= ?', start) if start
    run_scope = run_scope.where('starts_at < ?', finish) if finish

    runs_by_event_id = run_scope.to_a.group_by(&:event_id)
    keys.each do |event|
      fulfill(event, runs_by_event_id[event.id] || [])
    end
  end
end
