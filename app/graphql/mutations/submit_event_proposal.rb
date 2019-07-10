class Mutations::SubmitEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false

  argument :id, Integer, required: true

  load_and_authorize_convention_associated_model :event_proposals, :id, :submit

  def resolve(**_args)
    if event_proposal.status == 'draft'
      event_proposal.update!(status: 'proposed', submitted_at: Time.now)
      EventProposalsMailer.new_proposal(event_proposal).deliver_later(wait: 30.seconds)
      EventProposalsMailer.proposal_submit_confirmation(event_proposal).deliver_later(wait: 30.seconds)
    end

    { event_proposal: event_proposal }
  end
end
