class Mutations::DeleteEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false

  argument :id, Integer, required: true

  load_and_authorize_convention_associated_model :event_proposals, :id, :destroy

  def resolve(**_args)
    event_proposal.destroy!
    { event_proposal: event_proposal }
  end
end
