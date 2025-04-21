# frozen_string_literal: true
class EventProposals::NewProposalNotifier < Notifier
  include EventProposals::EventProposalNotificationsHelper

  dynamic_destination :event_proposal_owner do
    { event_proposal: }
  end
  dynamic_destination :triggering_user
  condition :event_category do
    { event_category: event_proposal.event_category }
  end

  attr_reader :event_proposal

  def initialize(event_proposal:, triggering_user: nil)
    @event_proposal = event_proposal
    super(convention: event_proposal.convention, event_key: "event_proposals/new_proposal", triggering_user:)
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
end
