# frozen_string_literal: true
class Mutations::TransitionEventProposal < Mutations::BaseMutation
  field :event_proposal, Types::EventProposalType, null: false, camelize: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :status, String, required: true
  argument :drop_event, Boolean, required: false, camelize: false

  attr_reader :event_proposal

  define_authorization_check do |args|
    @event_proposal = context[:convention].event_proposals.find(args[:transitional_id] || args[:id])
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
