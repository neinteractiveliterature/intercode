class ConventionDrop < Liquid::Drop
  attr_reader :convention
  delegate :name, :started?, :ended?, to: :convention
  alias_method :started, :started?
  alias_method :ended, :ended?

  def initialize(convention)
    @convention = convention
  end

  def runs_with_openings
    convention.runs.includes(:event, :signups).select(&:has_available_slots?)
  end

  def non_volunteer_runs_with_openings
    runs_with_openings.reject { |run| run.event.category == 'volunteer_event' }
  end

  def bio_eligible_user_con_profiles
    convention.user_con_profiles.can_have_bio.to_a
  end

  def staff_positions
    convention.staff_positions.to_a
  end

  def staff_positions_by_name
    convention.staff_positions.index_by do |staff_position|
      staff_position.name.gsub(/\W/, '_').downcase
    end
  end

  def ticket_types
    convention.ticket_types.to_a
  end
end
