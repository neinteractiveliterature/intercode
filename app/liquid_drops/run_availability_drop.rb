# The available slots for an event run
class RunAvailabilityDrop < Liquid::Drop
  # @api
  attr_reader :run_availability_presenter

  # @!method run
  #   @return [RunDrop] The run itself
  # @!method bucket_availabilities_with_any_slots
  #   @return [BucketAvailabilityDrop] The bucket availabilites in this run that have any available
  #                                    slots (both counted and not-counted)
  # @!method bucket_availabilities_with_counted_slots
  #   @return [BucketAvailabilityDrop] The bucket availabilites in this run with available counted
  #                                    slots
  # @!method buckets_with_not_counted_slots
  #   @return [BucketAvailabilityDrop] The bucket availabilites in this run with available
  #                                    not-counted slots
  delegate :run, :bucket_availabilities_with_any_slots,
    :bucket_availabilities_with_counted_slots, :bucket_availabilities_with_not_counted_slots,
    to: :run_availability_presenter

  # @api
  def initialize(run_availability_presenter)
    @run_availability_presenter = run_availability_presenter
  end

  # @return [Boolean] Are all buckets (both counted and non-counted) full?
  def full
    run_availability_presenter.full?
  end

  # @return [Boolean] Are there any buckets (either counted or non-counted) with availability?
  def has_any_slots # rubocop:disable Naming/PredicateName
    run_availability_presenter.has_any_slots?
  end

  # @return [Boolean] Are there any counted buckets with availability?
  def has_counted_slots # rubocop:disable Naming/PredicateName
    run_availability_presenter.has_counted_slots?
  end

  # @return [Boolean] Are there any not-counted buckets with availability?
  def has_not_counted_slots # rubocop:disable Naming/PredicateName
    run_availability_presenter.has_not_counted_slots?
  end

  # @return [String] The name of the event category for this event.  Useful for passing to the
  #                  Liquid "where" filter.
  def event_category_name
    run.event.event_category.name
  end
end
