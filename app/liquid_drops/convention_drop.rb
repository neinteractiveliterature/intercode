# The convention itself
class ConventionDrop < Liquid::Drop
  # @api
  attr_reader :convention

  # @!method id
  #   @return [Integer] The numeric database id of the convention
  # @!method name
  #   @return [String] The name of the convention
  # @!method event_mailing_list_domain
  #   @return [String] The domain name this convention uses for automatically-generated event
  #                    mailing lists
  # @!method accepting_proposals
  #   @return [Boolean] Whether or not the convention is currently accepting event proposals
  # @!method ticket_name
  #   @return [String] The name this convention uses for "tickets"
  delegate :id, :name, :started?, :ended?, :event_mailing_list_domain, :accepting_proposals, :ticket_name, to: :convention

  # @return [Boolean] Whether or not the convention has already started
  alias started started?

  # @return [Boolean] Whether or not the convention has already ended
  alias ended ended?

  # @api
  def initialize(convention)
    @convention = convention
  end

  # @return [Array<RunDrop>] Runs of events in this convention that have any available slots
  def runs_with_openings
    convention.runs.includes(:event, :signups).select(&:has_available_slots?)
  end

  # @return [Array<RunDrop>] Runs of non-volunteer events in this convention that have any available
  #                          slots
  def non_volunteer_runs_with_openings
    runs_with_openings.reject { |run| run.event.category == 'volunteer_event' }
  end

  # @return [Array<EventDrop>] Events at the convention
  def events
    @events ||= convention.events.includes(:runs).to_a
  end

  # @return [Array<RunDrop>] Event runs at the convention
  def runs
    @events ||= convention.runs.includes(:event).to_a
  end

  # @return [Array<UserConProfileDrop>] UserConProfiles in this convention that can have a bio
  def bio_eligible_user_con_profiles
    convention.user_con_profiles.can_have_bio.to_a
  end

  # @return [Array<ProductDrop>] All products in this convention
  def products
    convention.products.to_a
  end

  # @return [Array<ProductDrop>] Products in this convention that are available for purchase
  def available_products
    convention.products.available.to_a
  end

  # @return [Array<StaffPositionDrop>] All staff positions in this convention
  def staff_positions
    convention.staff_positions.visible.to_a
  end

  # @return [Hash<String, StaffPositionDrop>] All staff positions in this convention, indexed by
  #                                           name (all lowercase, spaces replaced with underscores)
  # @example Retrieving the vendor liaison email address for a convention
  #   {{ convention.staff_positions_by_name.vendor_liaison.email }}
  def staff_positions_by_name
    convention.staff_positions.index_by do |staff_position|
      staff_position.name.gsub(/\W/, '_').downcase
    end
  end

  # @return [Array<TicketTypeDrop>] All ticket types for this convention
  def ticket_types
    convention.ticket_types.to_a
  end

  # @return [Hash<String, Integer>] The number of tickets that have been issued in this convention,
  #                                 indexed by ticket type name
  # @example Retrieving the count of weekend tickets for a convention
  #   {{ convention.ticket_counts_by_type.weekend }}
  def ticket_counts_by_type
    ticket_counts_by_type_id = convention.tickets.group(:ticket_type_id).count

    convention.ticket_types.each_with_object({}) do |ticket_type, hash|
      hash[ticket_type.name] = ticket_counts_by_type_id[ticket_type.id] || 0
    end.merge('total' => ticket_counts_by_type_id.values.sum)
  end

  # @return [ScheduledValueDrop] The schedule of maximum event signups for this convention
  def maximum_event_signups
    ScheduledValueDrop.new(convention.maximum_event_signups, convention.timezone)
  end

  # @return [ActiveSupport::TimeWithZone] The time at which this convention starts
  def starts_at
    @starts_at ||= convention.starts_at&.in_time_zone(convention.timezone)
  end

  # @return [ActiveSupport::TimeWithZone] The time at which this convention ends
  def ends_at
    @ends_at ||= convention.ends_at&.in_time_zone(convention.timezone)
  end
end
