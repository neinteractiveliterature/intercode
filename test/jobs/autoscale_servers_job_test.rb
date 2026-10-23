# frozen_string_literal: true
require "test_helper"

class AutoscaleServersJobTest < ActiveJob::TestCase
  it "runs the autoscale service" do
    service = Minitest::Mock.new
    service.expect(:call!, nil)

    AutoscaleServersService.stub(:new, service) { AutoscaleServersJob.perform_now }

    service.verify
  end

  it "is enqueued on the default queue, away from the scheduler" do
    assert_enqueued_with(job: AutoscaleServersJob, queue: "intercode_test_default") do
      AutoscaleServersJob.perform_later
    end
  end
end
