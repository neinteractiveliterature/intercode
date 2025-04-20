# frozen_string_literal: true
class Mutations::SubmitEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false

  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :event_proposals, :id, :submit

  def resolve(**_args)
    if event_proposal.status == "draft"
      event_proposal.update!(status: "proposed", submitted_at: Time.zone.now)
      EventProposals::NewProposalNotifier.new(event_proposal:, triggering_user: current_user).deliver_later(
        wait: 5.seconds
      )
      EventProposals::ProposalSubmitConfirmationNotifier.new(
        event_proposal:,
        triggering_user: current_user
      ).deliver_later(wait: 5.seconds)
    end

    { event_proposal: }
  end
end
