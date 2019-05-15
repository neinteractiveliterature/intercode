desc 'Refresh app TLS certificates'
task refresh_certs: :environment do
  RefreshSSLCertificateService.new(
    heroku_api_key: ENV['HEROKU_API_KEY'],
    heroku_app_name: ENV['HEROKU_APP_NAME']
  ).call!
end
