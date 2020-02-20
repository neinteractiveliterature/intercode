require 'English'

class RefreshSslCertificateService < CivilService::Service
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
    if existing_certificate_matches_domains? && !existing_certificate_needs_renewal?
      Rails.logger.info <<~TEXT
        Not refreshing certificates because domains have not changed and expiration is over
        2 weeks away
      TEXT
      return success
    end

    install_acme
    request_certificate
    install_certificate
    success
  end

  def existing_certificate
    @existing_certificate ||= begin
      uri = URI::HTTPS.build(host: "www.#{root_domain}")
      Rails.logger.info "Checking #{uri} certificate"
      response = Net::HTTP.start(uri.host, uri.port, use_ssl: true)
      response.peer_cert
    end
  end

  def existing_certificate_needs_renewal?
    return true unless usable_endpoint && existing_certificate
    Time.zone.now >= (existing_certificate.not_after - 2.weeks)
  rescue StandardError => e
    Rails.logger.warn(e)
    true
  end

  def existing_certificate_matches_domains?
    return false unless usable_endpoint && existing_certificate
    existing_domains = parse_domains(existing_certificate)
    existing_domains.sort == ssl_domains.sort
  rescue StandardError => e
    Rails.logger.warn(e)
    false
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
        parse_domains(cert).include?(root_domain)
      end
    end
  end

  def parse_domains(cert)
    alt_names_extension = cert.extensions.map(&:to_h).find do |ext_hash|
      ext_hash['oid'] == 'subjectAltName'
    end
    if alt_names_extension
      alt_names_extension['value'].split(',').map(&:strip).map { |entry| entry.gsub(/\ADNS:/, '') }
    else
      []
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
      private_key: File.read(File.expand_path("#{root_domain}.key", certs_dir))
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
      all_ssl_domains = ([root_domain] + all_domains).flat_map do |domain|
        ssl_domains_for_host(domain)
      end.compact.uniq

      # filter out non-wildcarded domains that are already covered by a wildcard
      all_ssl_domains.select do |ssl_domain|
        next true if ssl_domain =~ /\A\*\./ # automatically include wildcards

        ssl_domain_parts = ssl_domain.split('.')
        wildcarded_domain_parts = ['*'] + ssl_domain_parts[1..-1]
        wildcarded_domain = wildcarded_domain_parts.join('.')
        !all_ssl_domains.include?(wildcarded_domain)
      end
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
