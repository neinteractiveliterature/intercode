desc 'Enqueue all notification jobs'
task run_notifications: :environment do
  [
    NotifyEventProposalChangesJob,
    NotifyEventChangesJob
  ].each(&:perform_later)
end
