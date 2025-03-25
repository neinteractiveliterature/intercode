# frozen_string_literal: true
class EventProposals::ProposalSubmitConfirmationNotifier < Notifier
  include EventProposals::EventProposalNotificationsHelper

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

  def destinations
    [event_proposal.owner]
  end

  def self.build_default_destinations(notification_template:)
    [notification_template.notification_destinations.new(dynamic_destination: :event_proposal_owner)]
  end

  def self.allowed_dynamic_destinations
    %i[triggering_user event_proposal_owner]
  end

  def self.allowed_conditions
    %i[event_category]
  end
end
