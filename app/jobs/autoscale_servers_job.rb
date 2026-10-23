# frozen_string_literal: true
# Scaling can wait on Fly for machines to start and stop, so it runs here rather than inline on the scheduler queue,
# where it would hold up time-sensitive tasks like executing signup rounds
class AutoscaleServersJob < ApplicationJob
  def perform
    AutoscaleServersService.new.call!
  end
end
