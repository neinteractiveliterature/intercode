desc 'Enqueue all notification jobs'
task run_notifications: :environment do
  RunNotificationsService.new.call!
end
