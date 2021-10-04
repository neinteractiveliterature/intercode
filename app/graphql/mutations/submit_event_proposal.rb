# frozen_string_literal: true
class Mutations::SubmitEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_convention_associated_model :event_proposals, :id, :submit

  def resolve(**_args)
    if event_proposal.status == 'draft'
      event_proposal.update!(status: 'proposed', submitted_at: Time.zone.now)
      EventProposals::NewProposalNotifier.new(event_proposal: event_proposal).deliver_later(wait: 5.seconds)
      EventProposals::ProposalSubmitConfirmationNotifier
        .new(event_proposal: event_proposal)
        .deliver_later(wait: 5.seconds)
    end

    { event_proposal: event_proposal }
  end
end
