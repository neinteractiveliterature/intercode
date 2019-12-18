class NotifyEventProposalChangesJob < ApplicationJob
  def perform
    NotifyFormResponseChangesService.new(
      scope: FormResponseChange.where(response_type: 'EventProposal'),
      send_mail: -> (event_proposal_id, compacted_changes) do
        event_proposal = EventProposal.find(event_proposal_id)
        EventProposals::ProposalUpdatedNotifier.new(
          event_proposal: event_proposal, changes: compacted_changes
        ).deliver_now
      end
    ).call!
  end
end
