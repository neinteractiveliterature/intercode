class Run < ApplicationRecord
  belongs_to :event
  belongs_to :updated_by, class_name: 'User', optional: true
  has_many :signups, dependent: :destroy
  has_many :signup_changes, dependent: :destroy
  has_many :signup_requests, foreign_key: 'target_run_id', dependent: :destroy
  has_and_belongs_to_many :rooms

  delegate :length_seconds, :registration_policy, :convention, to: :event
  delegate :bucket_with_key, to: :registration_policy

  def ends_at
    starts_at + length_seconds.seconds
  end

  def signups_by_bucket_key
    signups.group_by(&:bucket_key).tap do |hash|
      (registration_policy.buckets.map(&:key) + [nil]).each do |bucket_key|
        hash[bucket_key] ||= []
      end
    end
  end

  def bucket_full?(bucket_key)
    bucket_with_key(bucket_key).full?(signups_by_bucket_key[bucket_key])
  end

  def bucket_has_available_slots?(bucket_key)
    bucket = bucket_with_key(bucket_key)
    bucket && bucket.has_available_slots?(signups_by_bucket_key[bucket_key])
  end

  def full?
    registration_policy.buckets.all? { |bucket| bucket_full?(bucket.key) }
  end

  def has_available_slots?
    registration_policy.buckets.any? { |bucket| bucket_has_available_slots?(bucket.key) }
  end

  def available_slots_by_bucket_key
    signups = signups_by_bucket_key

    registration_policy.buckets.map(&:key).each_with_object({}) do |bucket_key, hash|
      hash[bucket_key] = bucket_with_key(bucket_key).available_slots(signups[bucket_key] || [])
    end
  end

  def timespan
    ScheduledValue::Timespan.new(start: starts_at, finish: ends_at)
  end

  def overlaps?(other_run)
    timespan.overlaps?(other_run.timespan)
  end

  def to_liquid
    RunDrop.new(self)
  end
end
