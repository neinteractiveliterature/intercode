# frozen_string_literal: true
require "test_helper"

class SkipIfAlreadyRunningTest < ActiveJob::TestCase
  class ExampleJob < ApplicationJob
    include SkipIfAlreadyRunning

    cattr_accessor :runs, default: 0

    def perform
      self.class.runs += 1
      nil # (a run that returns nothing must still count as having run)
    end
  end

  setup { ExampleJob.runs = 0 }

  it "runs the job when nothing else holds the lock" do
    ExampleJob.perform_now

    assert_equal 1, ExampleJob.runs
  end

  it "skips the job without running it when another run holds the lock" do
    # (advisory locks are re-entrant within one connection, so simulate another session holding it)
    ActiveRecord::Base.stub(
      :with_advisory_lock_result,
      ->(*, **) { WithAdvisoryLock::Result.new(lock_was_acquired: false) }
    ) { ExampleJob.perform_now }

    assert_equal 0, ExampleJob.runs
  end

  it "takes a lock named for the job without waiting for it" do
    taken = nil

    ActiveRecord::Base.stub(
      :with_advisory_lock_result,
      ->(name, **options, &block) do
        taken = [name, options]
        WithAdvisoryLock::Result.new(lock_was_acquired: true, result: block.call)
      end
    ) { ExampleJob.perform_now }

    assert_equal ["job_skip_if_already_running_test/example_job", { timeout_seconds: 0 }], taken
  end

  it "is used by the scheduled jobs that aren't safe to run twice at once" do
    [DropExpiredSignupsJob, NotifyEventChangesJob, NotifyEventProposalChangesJob, SendRemindersJob].each do |job_class|
      assert_includes job_class.ancestors, SkipIfAlreadyRunning, "#{job_class} should skip overlapping runs"
    end
  end
end
