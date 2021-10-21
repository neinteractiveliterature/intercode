# frozen_string_literal: true
class Mutations::DeleteEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :event_proposals, :id, :destroy

  def resolve(**_args)
    event_proposal.destroy!
    { event_proposal: event_proposal }
  end
end
