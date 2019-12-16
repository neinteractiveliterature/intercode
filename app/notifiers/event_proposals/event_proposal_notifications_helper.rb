module EventProposals::EventProposalNotificationsHelper
  def proposal_reviewer_staff_positions(event_proposal)
    event_proposal.convention.staff_positions
      .where(
        id: Permission.for_model(event_proposal.event_category)
          .where(permission: 'read_pending_event_proposals')
          .select(:staff_position_id)
      )
      .sort_by do |staff_position|
        staff_position.email.present? ? 0 : 1
      end
  end

  def global_proposal_chair_staff_positions(convention)
    convention.staff_positions
      .where(
        id: Permission.for_model(convention)
          .where(permission: 'read_pending_event_proposals')
          .select(:staff_position_id)
      )
  end

  def proposal_destinations(event_proposal)
    proposal_reviewer_staff_positions(event_proposal).presence ||
      global_proposal_chair_staff_positions(event_proposal.convention)
  end
end
