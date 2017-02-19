class ConventionDrop < Liquid::Drop
  attr_reader :convention
  delegate :name, to: :convention

  def initialize(convention)
    @convention = convention
  end

  def runs_with_openings
    convention.runs.includes(:event, :signups).select(&:has_available_slots?)
  end

  def non_volunteer_runs_with_openings
    runs_with_openings.reject { |run| run.event.category == 'volunteer_event' }
  end
end