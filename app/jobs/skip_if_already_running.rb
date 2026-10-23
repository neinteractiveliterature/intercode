# frozen_string_literal: true
# For scheduled jobs that aren't safe to run twice at once (e.g. ones that read a list of pending work, send mail and
# then mark it done). The scheduler can deliver a task to more than one worker, and SQS delivers at least once, so a
# run that finds another one in progress skips instead of waiting: the next scheduled run picks up anything left.
module SkipIfAlreadyRunning
  extend ActiveSupport::Concern

  included do
    around_perform do |job, block|
      result =
        ActiveRecord::Base.with_advisory_lock_result("job_#{job.class.name.underscore}", timeout_seconds: 0, &block)

      Rails.logger.info "#{job.class.name} is already running, skipping this run" unless result.lock_was_acquired?
    end
  end
end
