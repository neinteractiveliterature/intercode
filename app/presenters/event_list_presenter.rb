class EventListPresenter
  class UnknownSortError < StandardError; end

  attr_reader :convention, :sort

  def initialize(convention, sort: nil)
    @convention = convention
    @sort = sort.presence || 'title'
  end

  def sorted_events
    events = convention.events.active

    sorted_events = case sort
    when 'first_scheduled_run'
      run_time_by_event_id = Run.group(:event_id).minimum(:starts_at)

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

    sorted_events.select { |event| event.short_blurb.present? }
  end
end
