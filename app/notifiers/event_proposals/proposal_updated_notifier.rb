class EventProposals::ProposalUpdatedNotifier < Notifier
  include EventProposals::EventProposalNotificationsHelper

  attr_reader :event_proposal, :changes

  def initialize(event_proposal:, changes:)
    @event_proposal = event_proposal
    @changes = changes
    super(convention: event_proposal.convention, event_key: 'event_proposals/proposal_updated')
  end

  def liquid_assigns
    super.merge('event_proposal' => event_proposal, 'changes_html' => changes_html)
  end

  def destinations
    proposal_destinations(event_proposal)
  end

  def changes_html
    @changes_html ||= FormResponseChangeGroupPresenter.new(changes, event_proposal.convention).html
  end
end
