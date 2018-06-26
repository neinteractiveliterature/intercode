class RegistrationPolicy::BucketDrop < Liquid::Drop
  attr_reader :bucket
  delegate :key, :name, :description, :minimum_slots, :preferred_slots, :total_slots,
    :slots_limited, :anything, :not_counted, to: :bucket

  def initialize(bucket)
    @bucket = bucket
  end
end
