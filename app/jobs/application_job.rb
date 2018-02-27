class ApplicationJob < ActiveJob::Base
  include Rollbar::ActiveJob

  queue_as :default
end
