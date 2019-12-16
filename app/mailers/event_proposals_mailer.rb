class EventProposalsMailer < ApplicationMailer
  def new_proposal(event_proposal)
    notification_mail(EventProposals::NewProposalNotifier.new(event_proposal: event_proposal))
  end

  def proposal_submit_confirmation(event_proposal)
    notification_mail(
      EventProposals::ProposalSubmitConfirmationNotifier.new(event_proposal: event_proposal)
    )
  end

  def proposal_updated(event_proposal, changes)
    notification_mail(
      EventProposals::ProposalUpdatedNotifier.new(event_proposal: event_proposal, changes: changes)
    )
  end

  def unfinished_draft_reminder(event_proposal)
    notification_mail(
      EventProposals::UnfinishedDraftReminderNotifier.new(event_proposal: event_proposal)
    )
  end
end
