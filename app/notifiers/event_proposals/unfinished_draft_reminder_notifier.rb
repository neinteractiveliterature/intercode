class EventProposals::UnfinishedDraftReminderNotifier < Notifier
  attr_reader :event_proposal

  def initialize(event_proposal:)
    @event_proposal = event_proposal
    super(
      convention: event_proposal.convention, event_key: 'event_proposals/unfinished_draft_reminder'
    )
  end

  def liquid_assigns
    super.merge('event_proposal' => event_proposal)
  end

  def notification_context
    event_proposal.event_category
  end

  def destinations
    [event_proposal.owner]
  end
end
