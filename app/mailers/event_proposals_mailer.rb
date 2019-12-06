class EventProposalsMailer < ApplicationMailer
  def new_proposal(event_proposal)
    notification_template_mail(
      event_proposal.convention,
      'event_proposals/new_proposal',
      { 'event_proposal' => event_proposal },
      from: from_address_for_convention(event_proposal.convention),
      to: proposal_mail_destination(event_proposal)
    )
  end

  def proposal_submit_confirmation(event_proposal)
    proposal_reviewer_staff_positions = proposal_reviewer_staff_positions(event_proposal)

    notification_template_mail(
      event_proposal.convention,
      'event_proposals/proposal_submit_confirmation',
      {
        'event_proposal' => event_proposal,
        'proposal_reviewer_staff_positions' => proposal_reviewer_staff_positions
      },
      from: from_address_for_convention(event_proposal.convention),
      to: "#{event_proposal.owner.name_without_nickname} <#{event_proposal.owner.email}>"
    )
  end

  def proposal_updated(event_proposal, changes)
    changes_html = FormResponseChangeGroupPresenter.new(changes, event_proposal.convention).html

    notification_template_mail(
      event_proposal.convention,
      'event_proposals/proposal_updated',
      { 'event_proposal' => event_proposal, 'changes_html' => changes_html },
      from: from_address_for_convention(event_proposal.convention),
      to: proposal_mail_destination(event_proposal)
    )
  end

  def unfinished_draft_reminder(event_proposal)
    notification_template_mail(
      event_proposal.convention,
      'event_proposals/unfinished_draft_reminder',
      { 'event_proposal' => event_proposal },
      from: from_address_for_convention(event_proposal.convention),
      to: "#{event_proposal.owner.name_without_nickname} <#{event_proposal.owner.email}>"
    )
  end

  private

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

  def proposal_mail_destination(event_proposal)
    staff_positions = proposal_reviewer_staff_positions(event_proposal)
    proposal_chair_staff_position_emails = emails_for_staff_positions(staff_positions)

    if proposal_chair_staff_position_emails.any?
      proposal_chair_staff_position_emails
    else
      emails_for_staff_positions(global_proposal_chair_staff_positions(event_proposal.convention))
    end
  end
end
