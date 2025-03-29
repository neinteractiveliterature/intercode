# frozen_string_literal: true
module EventProposals::EventProposalNotificationsHelper
  def proposal_reviewer_staff_positions(event_proposal)
    event_proposal
      .convention
      .staff_positions
      .where(
        id:
          Permission
            .for_model(event_proposal.event_category)
            .where(permission: "read_pending_event_proposals")
            .select(:staff_position_id)
      )
      .sort_by { |staff_position| staff_position.email.present? ? 0 : 1 }
  end

  def category_proposal_reviewer_staff_positions(convention)
    permissions =
      Permission
        .where(permission: "read_pending_event_proposals")
        .where(event_category_id: convention.event_categories.select(:id))
        .includes(:event_category, :staff_position)

    permissions.map { |permission| [permission.event_category, permission.staff_position] }
  end

  def global_proposal_chair_staff_positions(convention)
    convention.staff_positions.where(
      id: Permission.for_model(convention).where(permission: "read_pending_event_proposals").select(:staff_position_id)
    )
  end

  def proposal_destinations(event_proposal)
    proposal_reviewer_staff_positions(event_proposal).presence ||
      global_proposal_chair_staff_positions(event_proposal.convention)
  end
end
