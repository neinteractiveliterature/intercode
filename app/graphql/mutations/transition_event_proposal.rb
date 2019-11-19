class Mutations::TransitionEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false, camelize: false

  argument :id, Int, required: true, camelize: false
  argument :status, String, required: true
  argument :drop_event, Boolean, required: false, camelize: false

  attr_reader :event_proposal

  define_authorization_check do |args|
    @event_proposal = context[:convention].event_proposals.find(args[:id])
    return false if args[:drop_event] && !policy(event_proposal.event).drop?

    policy(event_proposal).update?
  end

  def resolve(**args)
    if args[:status] == 'accepted' && !event_proposal.event
      AcceptEventProposalService.new(event_proposal: event_proposal).call!
    elsif args[:drop_event]
      DropEventService.new(event: event_proposal.event).call!
    end

    event_proposal.update!(status: args[:status])

    { event_proposal: event_proposal.reload }
  end
end
