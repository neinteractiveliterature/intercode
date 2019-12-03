class EventProposalsMailer < ApplicationMailer
  def new_proposal(event_proposal)
    @event_proposal = event_proposal
    use_convention_timezone(@event_proposal.convention) do
      event_proposal_mail(event_proposal, 'New')
    end
  end

  def proposal_submit_confirmation(event_proposal)
    @event_proposal = event_proposal
    @proposal_chair_staff_position = proposal_chair_staff_positions(event_proposal)
      .select { |staff_position| staff_position.email.present? }
      .first
    from_address = @proposal_chair_staff_position&.email || from_address_for_convention(event_proposal.convention)

    use_convention_timezone(@event_proposal.convention) do
      mail(
        from: from_address,
        to: "#{event_proposal.owner.name_without_nickname} <#{event_proposal.owner.email}>",
        subject: "#{subject_prefix(event_proposal)} Submitted"
      )
    end
  end

  def proposal_updated(event_proposal, changes)
    @event_proposal = event_proposal
    @changes = changes
    use_convention_timezone(@event_proposal.convention) do
      event_proposal_mail(event_proposal, 'Update')
    end
  end

  def unfinished_draft_reminder(event_proposal)
    @event_proposal = event_proposal

    use_convention_timezone(@event_proposal.convention) do
      mail(
        from: from_address_for_convention(event_proposal.convention),
        to: "#{event_proposal.owner.name_without_nickname} <#{event_proposal.owner.email}>",
        subject: "#{subject_prefix(event_proposal)} Reminder: #{event_proposal.title}"
      )
    end
  end

  private

  def proposal_chair_staff_positions(event_proposal)
    event_proposal.convention.staff_positions
      .where(
        id: Permission.for_model(event_proposal.event_category)
          .where(permission: 'read_pending_event_proposals')
          .select(:staff_position_id)
      )
      .sort_by do |staff_position|
        # TODO kill this with fire
        [
          staff_position.name =~ /proposals? (chair|coordinator)/i ? 0 : 1,
          staff_position.name =~ /bid (chair|coordinator)/i ? 0 : 1,
          staff_position.name =~ /people/i ? 0 : 1,
          staff_position.name
        ]
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
    staff_positions = proposal_chair_staff_positions(event_proposal)
    proposal_chair_staff_position_emails = emails_for_staff_positions(staff_positions)

    if proposal_chair_staff_position_emails.any?
      proposal_chair_staff_position_emails
    else
      emails_for_staff_positions(global_proposal_chair_staff_positions(event_proposal.convention))
    end
  end

  def subject_prefix(event_proposal)
    "[#{event_proposal.convention.name}: Event Proposal]"
  end

  def event_proposal_url_for_convention(event_proposal)
    url_with_convention_host(
      "/admin_event_proposals/#{event_proposal.to_param}",
      event_proposal.convention
    )
  end
  helper_method :event_proposal_url_for_convention

  def edit_proposal_url_for_convention(event_proposal)
    url_with_convention_host(
      "/event_proposals/#{event_proposal.to_param}/edit",
      event_proposal.convention
    )
  end
  helper_method :edit_proposal_url_for_convention

  def event_proposal_mail(event_proposal, status_change)
    mail(
      from: from_address_for_convention(event_proposal.convention),
      to: proposal_mail_destination(event_proposal),
      subject: "#{subject_prefix(event_proposal)} #{status_change}: #{event_proposal.title}"
    )
  end
end
