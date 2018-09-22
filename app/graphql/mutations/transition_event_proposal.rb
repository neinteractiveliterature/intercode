module Mutations
  class TransitionEventProposal < GraphQL::Schema::RelayClassicMutation
    field :event_proposal, Types::EventProposalType, null: false, camelize: false

    argument :id, Int, required: true, camelize: false
    argument :status, String, required: true

    def resolve(id:, status:)
      event_proposal = context[:convention].event_proposals.find(id)

      if status == 'accepted' && !event_proposal.event
        AcceptEventProposalService.new(event_proposal: event_proposal).call!
      end

      event_proposal.update!(status: status)

      { event_proposal: event_proposal }
    end
  end
end
