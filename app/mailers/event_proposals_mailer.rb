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

  private

  def proposal_mail_destination(convention)
    proposal_chair_staff_position = convention.staff_positions
      .where(name: 'Game Proposals Chair').first

    if proposal_chair_staff_position.email.present?
      proposal_chair_staff_position.email
    elsif proposal_chair_staff_position
      proposal_chair_staff_position.user_con_profiles.map do |user_con_profile|
        "#{user_con_profile.name} <#{user_con_profile.email}>"
      end
    else
      convention.user_con_profiles.where(proposal_chair: true).map do |user_con_profile|
        "#{user_con_profile.name} <#{user_con_profile.email}>"
      end
    end
  end

  def subject_prefix(event_proposal)
    "[#{event_proposal.convention.name}: Event Proposal]"
  end

  def event_proposal_url_for_convention(event_proposal)
    admin_event_proposal_url(event_proposal, host: event_proposal.convention.domain)
  end
  helper_method :event_proposal_url_for_convention

  def event_proposal_mail(event_proposal, status_change)
    mail(
      to: proposal_mail_destination(event_proposal.convention),
      subject: "#{subject_prefix(event_proposal)} #{status_change}: #{event_proposal.title}"
    )
  end
end
