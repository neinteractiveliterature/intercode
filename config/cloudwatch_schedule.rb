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

  task "execute_signup_rounds", cron: "0/15 * * * ? *" do
    SignupRound.execute_currently_due_rounds!
  end

  if ENV["HEROKU_API_TOKEN"].present? && ENV["HEROKU_APP_NAME"].present?
    task "refresh_certs", cron: "30 5 * * ? *" do
      RefreshSslCertificateService.new(
        heroku_api_token: ENV.fetch("HEROKU_API_TOKEN", nil),
        heroku_app_name: ENV.fetch("HEROKU_APP_NAME", nil),
        root_domain: ENV.fetch("INTERCODE_HOST", nil),
        **{
          no_wildcard_domains: ENV["INTERCODE_CERTS_NO_WILDCARD_DOMAINS"]&.split,
          skip_domains: ENV["INTERCODE_CERTS_SKIP_DOMAINS"]&.split,
          staging: ENV.fetch("INTERCODE_CERTS_STAGING", nil)
        }.compact
      ).call!
    end
  end
end
