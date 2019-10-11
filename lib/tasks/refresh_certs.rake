desc 'Refresh app TLS certificates'
task refresh_certs: :environment do
  Rails.logger = Logger.new(STDERR)
  RefreshSslCertificateService.new(
    heroku_api_token: ENV['HEROKU_API_TOKEN'],
    heroku_app_name: ENV['HEROKU_APP_NAME'],
    root_domain: ENV['INTERCODE_HOST'],
    **{
      no_wildcard_domains: ENV['INTERCODE_CERTS_NO_WILDCARD_DOMAINS']&.split(' '),
      skip_domains: ENV['INTERCODE_CERTS_SKIP_DOMAINS']&.split(' '),
      staging: ENV['INTERCODE_CERTS_STAGING']
    }.compact
  ).call!
end
