# frozen_string_literal: true
class EventProposals::UnfinishedDraftReminderNotifier < Notifier
  attr_reader :event_proposal

  dynamic_destination :event_proposal_owner do
    { event_proposal: }
  end
  condition :event_category do
    { event_category: event_proposal.event_category }
  end

  def initialize(event_proposal:)
    @event_proposal = event_proposal
    super(convention: event_proposal.convention, event_key: "event_proposals/unfinished_draft_reminder")
  end

  def liquid_assigns
    super.merge("event_proposal" => event_proposal)
  end

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :event_proposal_owner)]
  end
end
