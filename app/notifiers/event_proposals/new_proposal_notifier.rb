# frozen_string_literal: true
class EventProposals::NewProposalNotifier < Notifier
  include EventProposals::EventProposalNotificationsHelper
  extend EventProposals::EventProposalNotificationsHelper

  attr_reader :event_proposal

  def initialize(event_proposal:)
    @event_proposal = event_proposal
    super(convention: event_proposal.convention, event_key: "event_proposals/new_proposal")
  end

  def liquid_assigns
    super.merge("event_proposal" => event_proposal)
  end

  def destinations
    proposal_destinations(event_proposal)
  end

  def self.default_destinations(convention:)
    [:event_category_proposal_reviewers, *global_proposal_chair_staff_positions(convention)]
  end

  def self.allowed_dynamic_destinations
    [:triggering_user, :event_proposal_owner, :event_category_proposal_reviewers]
  end
end
