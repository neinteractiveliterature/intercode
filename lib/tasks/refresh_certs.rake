desc 'Refresh app TLS certificates'
task refresh_certs: :environment do
  Rails.logger = Logger.new(STDERR)
  RefreshSSLCertificateService.new(
    heroku_api_token: ENV['HEROKU_API_TOKEN'],
    heroku_app_name: ENV['HEROKU_APP_NAME'],
    root_domain: ENV['INTERCODE_HOST']
  ).call!
end
