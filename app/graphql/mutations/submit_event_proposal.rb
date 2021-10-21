# frozen_string_literal: true
class Mutations::SubmitEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

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
