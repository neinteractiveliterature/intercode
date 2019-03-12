class Mutations::TransitionEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false, camelize: false

  argument :id, Int, required: true, camelize: false
  argument :status, String, required: true
  argument :drop_event, Boolean, required: false, camelize: false

  def resolve(id:, status:, drop_event: false)
    event_proposal = context[:convention].event_proposals.find(id)

    if status == 'accepted' && !event_proposal.event
      AcceptEventProposalService.new(event_proposal: event_proposal).call!
    elsif drop_event
      DropEventService.new(event: event_proposal.event).call!
    end

    event_proposal.update!(status: status)

    { event_proposal: event_proposal.reload }
  end
end
