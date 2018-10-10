class RemindDraftEventProposalsJob < ApplicationJob
  def perform
    RemindDraftEventProposals.new.call!
  end
end
