require 'English'

class RefreshSSLCertificateService < CivilService::Service
  attr_reader :heroku_api_token, :heroku_app_name, :no_wildcard_domains, :skip_domains, :staging

  def initialize(
    heroku_api_token:,
    heroku_app_name:,
    no_wildcard_domains: [],
    skip_domains: [],
    staging: false
  )
    @heroku_api_token = heroku_api_token
    @heroku_app_name = heroku_app_name
    @no_wildcard_domains = no_wildcard_domains
    @skip_domains = skip_domains
    @staging = staging
  end

  private

  def inner_call
    Rails.logger.info 'Connecting to Heroku Platform API'
    heroku = PlatformAPI.connect_oauth(heroku_api_token)

    Rails.logger.info 'Getting app domains'
    all_domains = heroku.domain.list(heroku_app_name).map { |domain| domain['hostname'] }
    ssl_domains = ['neilhosting.net'] + all_domains.map do |domain|
      ssl_domain(domain)
    end.compact.uniq
    domain_args = ssl_domains.map do |domain|
      "-d #{Shellwords.escape domain}"
    end

    Rails.logger.info 'Installing acme.sh'
    sh 'curl https://get.acme.sh | sh'

    Rails.logger.info 'Requesting certificates'
    sh "~/.acme.sh/acme.sh #{staging ? '--staging ' : ''}\
--issue --challenge-alias neilhosting.net --dns dns_aws \
#{domain_args.join(' ')}"
  end

  def ssl_domain(host)
    return nil if host =~ /herokuapp\.com\z/
    return nil if skip_domains.include?(host)
    return host if no_wildcard_domains.include?(host)
    parts = host.split('.').reverse
    [*parts.take([2, parts.size - 1].max), '*'].reverse.join('.')
  end

  def sh(cmd)
    result = system("bash -c #{Shellwords.escape(cmd)}")
    raise "Command exited with status #{$CHILD_STATUS}" unless result
  end
end
