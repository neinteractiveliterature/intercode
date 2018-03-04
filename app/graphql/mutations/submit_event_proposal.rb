Mutations::SubmitEventProposal = GraphQL::Relay::Mutation.define do
  name 'SubmitEventProposal'
  return_field :event_proposal, Types::EventProposalType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    event_proposal = ctx[:convention].event_proposals.find(args[:id])

    if event_proposal.status == 'draft'
      event_proposal.update!(status: 'proposed', submitted_at: Time.now)
      EventProposalsMailer.new_proposal(event_proposal).deliver_later
    end

    { event_proposal: event_proposal }
  }
end
