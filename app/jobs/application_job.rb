class ApplicationJob < ActiveJob::Base
  include Rollbar::ActiveJob
end
