# frozen_string_literal: true
class SyncTeamMailingListJob < ApplicationJob
  def perform(event)
    SyncTeamMailingListService.new(event: event).call!
  end
end
