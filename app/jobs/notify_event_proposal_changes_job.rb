class NotifyEventProposalChangesJob < ApplicationJob
  def perform
    NotifyFormResponseChangesService.new(
      scope: FormResponseChange.where(response_type: 'EventProposal'),
      send_mail: -> (event_proposal_id, compacted_changes) do
        event_proposal = EventProposal.find(event_proposal_id)
        EventProposalsMailer.proposal_updated(event_proposal, compacted_changes).deliver_now
      end
    ).call!
  end
end
