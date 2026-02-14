class RunNotificationsService < CivilService::Service
  private

  def inner_call
    [NotifyEventProposalChangesJob, NotifyEventChangesJob, SendRemindersJob].each(&:perform_later)
    success
  end
end
