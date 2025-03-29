# frozen_string_literal: true
class EventProposals::UnfinishedDraftReminderNotifier < Notifier
  attr_reader :event_proposal

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

  def self.allowed_dynamic_destinations
    [:event_proposal_owner]
  end

  def self.allowed_conditions
    %i[event_category]
  end

  def dynamic_destination_evaluators
    {
      event_proposal_owner:
        Notifier::DynamicDestinations::EventProposalOwnerEvaluator.new(notifier: self, event_proposal:)
    }
  end
end
