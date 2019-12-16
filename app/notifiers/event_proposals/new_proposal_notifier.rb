class EventProposals::NewProposalNotifier < Notifier
  include EventProposals::EventProposalNotificationsHelper

  attr_reader :event_proposal

  def initialize(event_proposal:)
    @event_proposal = event_proposal
    super(convention: event_proposal.convention, event_key: 'event_proposals/new_proposal')
  end

  def liquid_assigns
    super.merge('event_proposal' => event_proposal)
  end

  def destinations
    proposal_destinations(event_proposal)
  end
end
