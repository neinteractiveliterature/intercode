namespace :release do
  desc 'Notify Rollbar of a release'
  task :notify do
    raise 'ROLLBAR_ACCESS_TOKEN must be set' unless ENV['ROLLBAR_ACCESS_TOKEN']
    raise 'REVISION must be set' unless ENV['REVISION']

    require 'net/http'
    require 'json'

    uri = URI.parse 'https://api.rollbar.com/api/1/deploy/'
    params = { access_token: ENV['ROLLBAR_ACCESS_TOKEN'], environment: ENV['RAILS_ENV'], revision: ENV['REVISION'] }

    request = Net::HTTP::Post.new(uri.request_uri)
    request.body = ::JSON.dump(params)

    Net::HTTP.start(uri.host, uri.port, :ENV, use_ssl: true) do |http|
      response = http.request(request)
      raise "Rollbar error: #{response.code}\n#{response.body}" unless response.is_a?(Net::HTTPSuccess)
    end

    puts 'Rollbar notification complete.'
  end

  desc 'Perform an app release (database migrations and deploy tracking)'
  task perform: :environment do
    puts 'Running database migrations'
    Rake::Task['db:migrate'].invoke

    puts 'Updating CloudWatch schedule'
    Rake::Task['cloudwatch_scheduler:setup'].invoke

    puts 'Running release notification'
    Rake::Task['release:notify'].invoke if ENV['ROLLBAR_ACCESS_TOKEN'].present?
  end
end
