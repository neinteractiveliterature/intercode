# frozen_string_literal: true
class SendRemindersJob < ApplicationJob
  def perform
    RemindDraftEventProposals.new.call!
    RemindQueueWithoutTicket.new.call!
  end
end
