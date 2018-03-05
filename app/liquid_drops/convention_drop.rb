class ConventionDrop < Liquid::Drop
  attr_reader :convention
  delegate :id, :name, :started?, :ended?, :accepting_proposals, :ticket_name, to: :convention
  alias started started?
  alias ended ended?

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

  def products
    convention.products.to_a
  end

  def available_products
    convention.products.available.to_a
  end

  def staff_positions
    convention.staff_positions.visible.to_a
  end

  def staff_positions_by_name
    convention.staff_positions.visible.index_by do |staff_position|
      staff_position.name.gsub(/\W/, '_').downcase
    end
  end

  def ticket_types
    convention.ticket_types.to_a
  end

  def ticket_counts_by_type
    ticket_counts_by_type_id = convention.tickets.group(:ticket_type_id).count

    convention.ticket_types.each_with_object({}) do |ticket_type, hash|
      hash[ticket_type.name] = ticket_counts_by_type_id[ticket_type.id] || 0
    end.merge('total' => ticket_counts_by_type_id.values.sum)
  end

  def maximum_event_signups
    ScheduledValueDrop.new(convention.maximum_event_signups, convention.timezone)
  end

  def starts_at
    @starts_at ||= convention.starts_at&.in_time_zone(convention.timezone)
  end

  def ends_at
    @ends_at ||= convention.ends_at&.in_time_zone(convention.timezone)
  end
end
