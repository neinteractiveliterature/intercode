class EventFreezeBucketAssignmentsService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :anything_signups_with_preference
  end
  self.result_class = Result

  validate :event_must_have_single_run

  attr_reader :event, :whodunit

  def initialize(event:, whodunit: nil)
    @event = event
    @whodunit = whodunit
  end

  include SkippableAdvisoryLock

  private

  def inner_call
    lock_all_runs do
      Event.transaction do
        new_policy = build_frozen_registration_policy

        event.allow_registration_policy_change = true
        event.update!(registration_policy: new_policy)
        anything_signups_with_preference.each do |signup|
          signup.update!(bucket_key: signup.requested_bucket_key, updated_by: whodunit)
          signup.log_signup_change!(action: "freeze_bucket_assignments")
        end
      end
    end

    success(anything_signups_with_preference:)
  end

  def anything_signups_with_preference
    @anything_signups_with_preference ||=
      event.runs.first.signups.filter do |signup|
        signup.confirmed? && signup.bucket.anything? && !signup.no_preference?
      end
  end

  def build_frozen_registration_policy
    expand_buckets_count =
      anything_signups_with_preference.each_with_object({}) do |signup, hash|
        hash[signup.requested_bucket_key] ||= 0
        hash[signup.requested_bucket_key] += 1
      end

    new_policy = event.registration_policy.dup
    new_policy.freeze_no_preference_buckets = true
    expand_buckets_count.each do |bucket_key, amount|
      new_policy.bucket_with_key(bucket_key).total_slots += amount
      new_policy.anything_bucket.total_slots -= amount
    end

    new_policy
  end

  def lock_all_runs(&block)
    event
      .runs
      .inject(block) { |memo, acc| -> { with_advisory_lock_unless_skip_locking("run_#{acc.id}_signups", &memo) } }
      .call
  end

  def event_must_have_single_run
    return if event.runs.size == 1

    errors.add :base,
               I18n.t(
                 "freeze_bucket_assignments.errors.event_must_have_single_run",
                 event_title: event.title,
                 count: event.runs.size
               )
  end
end
