# frozen_string_literal: true
require "cloudwatch_scheduler"

CloudwatchScheduler() do |_config|
  # every hour at 10 minutes past the hour
  task "run_notifications", cron: "10 * * * ? *" do
    RunNotificationsService.new.call!
  end

  # every day at 5:00am
  task "cleanup", cron: "0 5 * * ? *" do
    CleanupDbService.new.call!
  end

  task "autoscale", cron: "0/15 * * * ? *" do
    AutoscaleServersService.new.call!
  end

  task "drop_expired_signups", cron: "0/10 * * * ? *" do
    DropExpiredSignupsJob.perform_later
  end

  task "execute_signup_rounds", cron: "0/5 * * * ? *" do
    SignupRound.execute_currently_due_rounds!
  end
end
