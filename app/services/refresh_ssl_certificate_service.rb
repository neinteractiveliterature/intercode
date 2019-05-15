require 'English'

class RefreshSSLCertificateService < CivilService::Service
  attr_reader :heroku_api_token, :heroku_app_name, :root_domain, :no_wildcard_domains,
    :skip_domains, :staging

  def initialize(
    heroku_api_token:,
    heroku_app_name:,
    root_domain:,
    no_wildcard_domains: [],
    skip_domains: [],
    staging: false
  )
    @heroku_api_token = heroku_api_token
    @heroku_app_name = heroku_app_name
    @root_domain = root_domain
    @no_wildcard_domains = no_wildcard_domains
    @skip_domains = skip_domains
    @staging = staging
  end

  private

  def inner_call
    unless existing_certificate_needs_renewal?
      Rails.logger.info 'Not refreshing certificates because expiration is over 2 weeks away'
      return success
    end

    install_acme
    request_certificate
    install_certificate
    success
  end

  def existing_certificate_needs_renewal?
    return true unless usable_endpoint
    uri = URI::HTTPS.build(host: "www.#{root_domain}")
    Rails.logger.info "Checking #{uri} certificate"
    response = Net::HTTP.start(uri.host, uri.port, use_ssl: true)
    cert = response.peer_cert
    Time.now >= (cert.not_after - 2.weeks)
  rescue StandardError => e
    Rails.logger.warn(e)
    true
  end

  def heroku
    @heroku ||= begin
      Rails.logger.info 'Connecting to Heroku Platform API'
      PlatformAPI.connect_oauth(heroku_api_token)
    end
  end

  def install_acme
    Rails.logger.info 'Installing acme.sh'
    sh 'curl https://get.acme.sh | sh'
  end

  def sni_endpoints
    @sni_endpoints ||= begin
      Rails.logger.info 'Requesting existing SNI endpoints'
      heroku.sni_endpoint.list(heroku_app_name)
    end
  end

  def usable_endpoint
    @usable_endpoint ||= begin
      sni_endpoints.find do |endpoint|
        pem = endpoint['certificate_chain']
        cert = OpenSSL::X509::Certificate.new(pem)
        alt_names_extension = cert.extensions.map(&:to_h).find do |ext_hash|
          ext_hash['oid'] == 'subjectAltName'
        end
        alt_names_extension && alt_names_extension['value'].include?("DNS:*.#{root_domain}")
      end
    end
  end

  def update_endpoint(endpoint, body)
    Rails.logger.info("Updating SNI endpoint #{endpoint['name']}")
    heroku.sni_endpoint.update(heroku_app_name, endpoint['id'], body)
  end

  def replace_endpoint(body)
    sni_endpoints.each do |endpoint|
      Rails.logger.info("Deleting unusable SNI endpoint #{endpoint['name']}")
      heroku.sni_endpoint.delete(heroku_app_name, endpoint['id'])
    end

    Rails.logger.info('Creating SNI endpoint')
    new_endpoint = heroku.sni_endpoint.create(heroku_app_name, body)
    Rails.logger.info("Endpoint #{new_endpoint['name']} created")
  end

  def install_certificate
    certs_dir = File.expand_path(".acme.sh/#{root_domain}", Dir.home)
    body = {
      certificate_chain: File.read(File.expand_path('fullchain.cer', certs_dir)),
      private_key: File.read(File.expand_path("#{root_domain}.key", certs_dir)),
    }

    if usable_endpoint
      update_endpoint(usable_endpoint, body)
    else
      replace_endpoint(body)
    end
  end

  def request_certificate
    domain_args = ssl_domains.map do |domain|
      "-d #{Shellwords.escape domain}"
    end

    Rails.logger.info 'Requesting certificates'
    sh "~/.acme.sh/acme.sh #{staging ? '--staging ' : ''}\
--issue --challenge-alias #{root_domain} --dns dns_aws \
#{domain_args.join(' ')}"
  end

  def ssl_domains
    @ssl_domains || begin
      Rails.logger.info 'Getting app domains'
      all_domains = heroku.domain.list(heroku_app_name).map { |domain| domain['hostname'] }
      ([root_domain] + all_domains).flat_map do |domain|
        ssl_domains_for_host(domain)
      end.compact.uniq
    end
  end

  def ssl_domains_for_host(host)
    return nil if host =~ /herokuapp\.com\z/
    return nil if skip_domains.include?(host)
    return host if no_wildcard_domains.include?(host)
    parts = host.split('.').reverse
    root_domain_parts = parts.take([2, parts.size - 1].max)
    [root_domain_parts, root_domain_parts + ['*']].map do |domain_parts|
      domain_parts.reverse.join('.')
    end
  end

  def sh(cmd)
    result = system("bash -c #{Shellwords.escape(cmd)}")
    raise "Command exited with status #{$CHILD_STATUS}" unless result
  end
end
