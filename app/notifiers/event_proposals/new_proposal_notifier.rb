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

  def self.build_default_destinations(notification_template:)
    [
      *global_proposal_chair_staff_positions(notification_template.convention).map do |staff_position|
        notification_template.notification_destinations.new(staff_position:)
      end,
      *category_proposal_reviewer_staff_positions(notification_template.convention).map do |(category, staff_position)|
        notification_template.notification_destinations.new(
          staff_position:,
          conditions: {
            event_category: category.id
          }
        )
      end
    ]
  end

  def self.allowed_dynamic_destinations
    %i[triggering_user event_proposal_owner]
  end

  def self.allowed_conditions
    %i[event_category]
  end

  def dynamic_destination_evaluators
    {
      event_proposal_owner:
        Notifier::DynamicDestinations::EventProposalOwnerEvaluator.new(notifier: self, event_proposal:),
      triggering_user: Notifier::DynamicDestinations::TriggeringUserEvaluator.new(notifier: self)
    }
  end
end
