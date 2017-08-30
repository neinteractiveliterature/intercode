class EventProposalsMailer < ApplicationMailer
  def new_proposal(event_proposal)
    @event_proposal = event_proposal

    mail(
      to: proposal_mail_destination(event_proposal.convention),
      subject: "#{subject_prefix(event_proposal)} New: #{event_proposal.title}"
    )
  end

  def proposal_updated(event_proposal)
    @event_proposal = event_proposal

    mail(
      to: proposal_mail_destination(event_proposal.convention),
      subject: "#{subject_prefix(event_proposal)} New: #{event_proposal.title}"
    )
  end

  private

  def proposal_mail_destination(convention)
    convention.staff_positions.find_by(name: 'Game Proposals Chair').user_con_profiles.map do |user_con_profile|
      "#{user_con_profile.name} <#{user_con_profile.email}>"
    end
  end

  def subject_prefix(event_proposal)
    "[#{event_proposal.title}: Event Proposal]"
  end

  def event_proposal_url_for_convention(event_proposal)
    admin_event_proposal_url(event_proposal, host: event_proposal.convention.domain)
  end
  helper_method :event_proposal_url_for_convention
end
