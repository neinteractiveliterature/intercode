# frozen_string_literal: true
class RemindDraftEventProposalsJob < ApplicationJob
  def perform
    RemindDraftEventProposals.new.call!
  end
end
