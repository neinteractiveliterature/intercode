# The available slots for a single bucket in an event run
class BucketAvailabilityDrop < Liquid::Drop
  # @api
  attr_reader :bucket_availability_presenter

  # @!method bucket
  #   @return [RegistrationPolicy::BucketDrop] The bucket itself
  # @!method confirmed_count
  #   @return [Integer] The number of filled slots in this bucket (whether counted or not-counted)
  # @!method available_slots
  #   @return [Integer] The number of slots available in this bucket (or nil if the bucket is
  #                     unlimited)
  delegate :bucket, :confirmed_count, :available_slots,
    to: :bucket_availability_presenter

  # @api
  def initialize(bucket_availability_presenter)
    @bucket_availability_presenter = bucket_availability_presenter
  end

  # @return [Boolean] Is this bucket full?  (Always false for unlimited buckets.)
  def full
    bucket_availability_presenter.full?
  end

  # @return [Boolean] Does this bucket have any available slots?
  #                   (Always true for unlimited buckets.)
  def has_availablity # rubocop:disable Naming/PredicateName
    bucket_availability_presenter.has_availability?
  end
end
