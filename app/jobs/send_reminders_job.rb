# frozen_string_literal: true
class SendRemindersJob < ApplicationJob
  include SkipIfAlreadyRunning

  def perform
    RemindDraftEventProposals.new.call!
    RemindQueueWithoutTicket.new.call!
  end
end
