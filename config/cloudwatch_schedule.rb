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

  if ENV["HEROKU_API_TOKEN"].present? && ENV["HEROKU_APP_NAME"].present?
    task "refresh_certs", cron: "30 5 * * ? *" do
      RefreshSslCertificateService.new(
        heroku_api_token: ENV["HEROKU_API_TOKEN"],
        heroku_app_name: ENV["HEROKU_APP_NAME"],
        root_domain: ENV["INTERCODE_HOST"],
        **{
          no_wildcard_domains: ENV["INTERCODE_CERTS_NO_WILDCARD_DOMAINS"]&.split(" "),
          skip_domains: ENV["INTERCODE_CERTS_SKIP_DOMAINS"]&.split(" "),
          staging: ENV["INTERCODE_CERTS_STAGING"]
        }.compact
      ).call!
    end
  end
end
