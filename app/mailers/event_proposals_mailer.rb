class EventProposalsMailer < ApplicationMailer
  helper :form_response

  def new_proposal(event_proposal)
    @event_proposal = event_proposal
    event_proposal_mail(event_proposal, 'New')
  end

  def proposal_updated(event_proposal, changes)
    @event_proposal = event_proposal
    @changes = changes
    event_proposal_mail(event_proposal, 'Update')
  end

  def unfinished_draft_reminder(event_proposal)
    @event_proposal = event_proposal

    mail(
      from: from_address_for_convention(event_proposal.convention),
      to: "#{event_proposal.owner.name_without_nickname} <#{event_proposal.owner.email}>",
      subject: "#{subject_prefix(event_proposal)} Reminder: #{event_proposal.title}"
    )
  end

  private

  def proposal_mail_destination(event_proposal)
    proposal_chair_staff_positions = event_proposal.convention.staff_positions
      .where(
        id: Permission.for_model(event_proposal.event_category)
          .where(permission: 'read_pending_event_proposals')
          .select(:staff_position_id)
      )

    proposal_chair_staff_position_emails = proposal_chair_staff_positions.flat_map do |staff_position|
      staff_position.email.presence || staff_position.user_con_profiles.map do |user_con_profile|
        "#{user_con_profile.name} <#{user_con_profile.email}>"
      end
    end

    if proposal_chair_staff_position_emails.any?
      proposal_chair_staff_position_emails
    else
      users_with_priv = event_proposal.convention.user_con_profiles.where(staff: true).to_a

      users_with_priv.map do |user_con_profile|
        "#{user_con_profile.name} <#{user_con_profile.email}>"
      end
    end
  end

  def subject_prefix(event_proposal)
    "[#{event_proposal.convention.name}: Event Proposal]"
  end

  def event_proposal_url_for_convention(event_proposal)
    "#{admin_event_proposals_url(host: event_proposal.convention.domain)}/#{event_proposal.id}"
  end
  helper_method :event_proposal_url_for_convention

  def event_proposal_mail(event_proposal, status_change)
    mail(
      from: from_address_for_convention(event_proposal.convention),
      to: proposal_mail_destination(event_proposal),
      subject: "#{subject_prefix(event_proposal)} #{status_change}: #{event_proposal.title}"
    )
  end
end
