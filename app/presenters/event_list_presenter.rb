class EventListPresenter
  class UnknownSortError < StandardError ; end

  attr_reader :convention, :sort

  def initialize(convention, sort: nil)
    @convention = convention
    @sort = sort.presence || 'title'
  end

  def sorted_events
    events = convention.events.active.where.not(category: 'filler')

    case sort
    when 'first_scheduled_run'
      run_time_by_event_id = Run.group(:event_id).minimum(:starts_at)
      event_id_order = run_time_by_event_id.to_a.sort_by(&:second).map(&:first)

      events.includes(:runs).sort_by do |event|
        [
          run_time_by_event_id[event.id] || convention.ends_at,
          Event.normalize_title_for_sort(event.title)
        ]
      end
    when 'accepted_asc'
      events.order(created_at: 'asc')
    when 'accepted_desc'
      events.order(created_at: 'desc')
    when 'title'
      Event.title_sort(events)
    else
      raise UnknownSortError, "Unknown sort for events: #{sort}"
    end
  end
end
