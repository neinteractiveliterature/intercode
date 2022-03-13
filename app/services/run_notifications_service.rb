class RunNotificationsService < CivilService::Service
  private

  def inner_call
    [NotifyEventProposalChangesJob, NotifyEventChangesJob, RemindDraftEventProposalsJob].each(&:perform_later)
    success
  end
end
