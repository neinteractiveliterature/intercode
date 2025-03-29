# frozen_string_literal: true
class EventProposals::ProposalSubmitConfirmationNotifier < Notifier
  include EventProposals::EventProposalNotificationsHelper

  dynamic_destination :event_proposal_owner do
    { event_proposal: }
  end
  dynamic_destination :triggering_user
  condition :event_category do
    { event_category: event_proposal.event_category }
  end

  attr_reader :event_proposal

  def initialize(event_proposal:)
    @event_proposal = event_proposal
    super(convention: event_proposal.convention, event_key: "event_proposals/proposal_submit_confirmation")
  end

  def liquid_assigns
    super.merge(
      "event_proposal" => event_proposal,
      "proposal_reviewer_staff_positions" => proposal_reviewer_staff_positions(event_proposal)
    )
  end

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :event_proposal_owner)]
  end
end
