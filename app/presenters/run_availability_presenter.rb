class RunAvailabilityPresenter
  class BucketAvailability
    attr_reader :bucket, :signup_count_presenter

    def initialize(bucket, signup_count_presenter)
      @bucket = bucket
      @signup_count_presenter = signup_count_presenter
    end

    def confirmed_count
      signup_count_presenter.confirmed_count_for_bucket_including_not_counted(bucket.key)
    end

    def available_slots
      return nil if bucket.slots_unlimited?
      bucket.total_slots - confirmed_count
    end

    def has_availability?
      return true if bucket.slots_unlimited?
      available_slots > 0
    end

    def full?
      !has_availability?
    end

    def to_liquid
      BucketAvailabilityDrop.new(self)
    end
  end

  def self.for_runs(runs)
    SignupCountPresenter.for_runs(runs).transform_values do |signup_count_presenter|
      new(signup_count_presenter.run, signup_count_presenter: signup_count_presenter)
    end
  end

  attr_reader :run, :signup_count_presenter
  delegate :event, to: :run
  delegate :registration_policy, to: :event

  def initialize(run, signup_count_presenter: nil)
    @run = run
    @signup_count_presenter = signup_count_presenter || SignupCountPresenter.new(run)
  end

  def availability_by_bucket
    @bucket_availabilities ||= registration_policy.buckets.map do |bucket|
      BucketAvailability.new(bucket, signup_count_presenter)
    end
  end

  def full?
    availability_by_bucket.all?(&:full?)
  end

  def bucket_availabilities_with_any_slots
    availability_by_bucket.select(&:has_availability?)
  end

  def bucket_availabilities_with_counted_slots
    availability_by_bucket.select { |ba| ba.has_availability? && ba.bucket.counted? }
  end

  def bucket_availabilities_with_not_counted_slots
    availability_by_bucket.select { |ba| ba.has_availability? && ba.bucket.not_counted? }
  end

  def has_any_slots?
    bucket_availabilities_with_any_slots.any?
  end

  def has_counted_slots?
    bucket_availabilities_with_counted_slots.any?
  end

  def has_not_counted_slots?
    bucket_availabilities_with_not_counted_slots.any?
  end

  def to_liquid
    RunAvailabilityDrop.new(self)
  end
end
