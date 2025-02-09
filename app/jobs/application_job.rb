# frozen_string_literal: true
class ApplicationJob < ActiveJob::Base
  include Rollbar::ActiveJob

  queue_as :default

  discard_on ActiveJob::DeserializationError do |job, error|
    ErrorReporting.warn(
      "Skipping job because of ActiveJob::DeserializationError (#{error.message})",
      arguments: job.arguments
    )
  end
end
