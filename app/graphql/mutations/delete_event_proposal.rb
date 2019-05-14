class Mutations::DeleteEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    event_proposal = convention.event_proposals.find(args[:id])
    event_proposal.destroy!
    { event_proposal: event_proposal }
  end
end
