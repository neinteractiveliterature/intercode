namespace :release do
  desc "Notify monitoring services of a release"
  task :notify do
    Rake::Task["release:notify:rollbar"].invoke if ENV["ROLLBAR_ACCESS_TOKEN"].present?
    Rake::Task["release:notify:sentry"].invoke if ENV["SENTRY_RELEASE_TOKEN"].present?
  end

  namespace :notify do
    desc "Notify Rollbar of a release"
    task :rollbar do
      raise "ROLLBAR_ACCESS_TOKEN must be set" unless ENV["ROLLBAR_ACCESS_TOKEN"]
      raise "REVISION must be set" unless ENV["REVISION"]

      require "net/http"
      require "json"

      uri = URI.parse "https://api.rollbar.com/api/1/deploy/"
      params = { access_token: ENV["ROLLBAR_ACCESS_TOKEN"], environment: ENV["RAILS_ENV"], revision: ENV["REVISION"] }

      request = Net::HTTP::Post.new(uri.request_uri)
      request.body = ::JSON.dump(params)

      Net::HTTP.start(uri.host, uri.port, :ENV, use_ssl: true) do |http|
        response = http.request(request)
        raise "Rollbar error: #{response.code}\n#{response.body}" unless response.is_a?(Net::HTTPSuccess)
      end

      puts "Rollbar notification complete."
    end

    desc "Notify Sentry of a release"
    task :sentry do
      raise "SENTRY_ORGANIZATION_ID must be set" unless ENV["SENTRY_ORGANIZATION_ID"]
      raise "SENTRY_RELEASE_TOKEN must be set" unless ENV["SENTRY_RELEASE_TOKEN"]
      raise "REVISION must be set" unless ENV["REVISION"]

      require "net/http"
      require "json"

      uri =
        URI.parse "https://sentry.io/api/0/organizations/#{ENV.fetch("SENTRY_ORGANIZATION_ID")}/releases/intercode-#{ENV.fetch("REVISION")}/deploys/"
      params = { environment: ENV["RAILS_ENV"], projects: [Sentry.get_current_client.configuration.dsn.project_id] }

      request = Net::HTTP::Post.new(uri)
      request.body = ::JSON.dump(params)
      request["Authorization"] = "Bearer #{ENV.fetch("SENTRY_RELEASE_TOKEN")}"
      request["Content-Type"] = "application/json"

      Net::HTTP.start(uri.host, uri.port, :ENV, use_ssl: true) do |http|
        response = http.request(request)
        unless response.is_a?(Net::HTTPSuccess)
          raise "Sentry error: #{response.code}\n#{response.body}\n\nRequest URI: #{uri}\nRequest body: #{request.body}"
        end
      end

      puts "Sentry notification complete."
    end
  end

  desc "Perform an app release (database migrations and deploy tracking)"
  task perform: :environment do
    puts "Running database migrations"
    Rake::Task["db:migrate"].invoke

    puts "Updating CloudWatch schedule"
    Rake::Task["cloudwatch_scheduler:setup"].invoke

    puts "Running applicable release notifications"
    Rake::Task["release:notify"].invoke
  end
end
