# frozen_string_literal: true
class Mutations::DeleteEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_convention_associated_model :event_proposals, :id, :destroy

  def resolve(**_args)
    event_proposal.destroy!
    { event_proposal: event_proposal }
  end
end
