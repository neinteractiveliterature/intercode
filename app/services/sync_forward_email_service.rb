class SyncForwardEmailService < CivilService::Service
  attr_reader :mappings_by_domain

  def initialize(mappings_by_domain:)
    @mappings_by_domain = mappings_by_domain
    @connection =
      Faraday.new(url: "https://api.forwardemail.net") do |conn|
        conn.request :authorization, :basic, ENV.fetch("FORWARDEMAIL_API_KEY"), ""
        conn.request :url_encoded
        conn.response :json
        conn.response :raise_error
      end
  end

  def inner_call
    existing_domains = fetch_domains
    return if existing_domains.empty?

    mappings_by_domain.each_key do |domain|
      if existing_domains[domain].nil?
        Rails.logger.info "Creating domain #{domain}"
        @connection.post("/v1/domains", domain:, catchall: false)
      end

      Rails.logger.info("Syncing mappings for domain #{domain}")
      sync_mappings_for_domain(domain:)
    rescue StandardError => e
      Rails.logger.error("Error syncing mappings for domain #{domain}: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
    end

    success
  end

  def sync_mappings_for_domain(domain:) # rubocop:disable Metrics/AbcSize,Metrics/MethodLength
    mappings = @mappings_by_domain[domain].index_by { |m| m.catch_all? ? "*" : m.inbound_local }
    return if mappings.nil?

    mapping_names = Set.new(mappings.keys)
    aliases = fetch_aliases(domain:)

    add_aliases = mapping_names - aliases.keys
    delete_aliases = Set.new(aliases.keys) - mapping_names
    check_aliases = mapping_names & aliases.keys

    add_aliases.each do |alias_name|
      mapping = mappings.fetch(alias_name)
      add_alias(alias_name:, domain:, recipients: mapping.destination_addresses)
    end

    delete_aliases.each do |alias_name|
      a = aliases.fetch(alias_name)
      delete_alias(alias_name:, id: a.fetch("id"), domain:)
    end

    check_aliases.each do |alias_name|
      mapping = mappings.fetch(alias_name)
      a = aliases.fetch(alias_name)

      if mapping.destination_addresses.sort != a.fetch("recipients").sort
        update_alias(alias_name:, domain:, id: a.fetch("id"), recipients: mapping.destination_addresses)
      end
    end
  end

  def fetch_domains
    paginate_request("/v1/domains?pagination=true").index_by { |d| d["name"] }
  end

  def fetch_aliases(domain:)
    paginate_request("/v1/domains/#{domain}/aliases?pagination=true").index_by { |a| a["name"] }
  end

  def add_alias(alias_name:, domain:, recipients:)
    Rails.logger.info "Adding alias for #{alias_name}@#{domain}"
    @connection.post("/v1/domains/#{domain}/aliases", name: alias_name, recipients:)
  rescue StandardError => e
    ErrorReporting.error(e, operation: "add_alias", domain:, alias_name:, recipients:)
    raise e
  end

  def delete_alias(alias_name:, id:, domain:)
    Rails.logger.info "Deleting alias for #{alias_name}@#{domain}"
    @connection.delete("/v1/domains/#{domain}/aliases/#{id}")
  rescue StandardError => e
    ErrorReporting.error(e, operation: "delete_alias", domain:, alias_name:, id:)
    raise e
  end

  def update_alias(alias_name:, id:, domain:, recipients:)
    Rails.logger.info "Updating alias for #{alias_name}@#{domain}"
    @connection.put("/v1/domains/#{domain}/aliases/#{id}", recipients:)
  rescue StandardError => e
    ErrorReporting.error(e, operation: "update_alias", domain:, alias_name:, id:, recipients:)
    raise e
  end

  def paginate_request(path)
    response = @connection.get(path)
    return response if response.status != 200

    results = response.body

    while response.headers["X-Page-Current"].to_i < response.headers["X-Page-Count"].to_i
      uri = URI.parse(path)
      uri.query =
        Rack::Utils.build_query(
          Rack::Utils.parse_query(uri.query).merge("page" => response.headers["X-Page-Current"].to_i + 1)
        )
      response = @connection.get("#{path}&page=#{response.headers["X-Page-Current"].to_i + 1}")
      results += response.body
    end

    results
  end

  def forwardemail_instructions
    mappings_by_domain.transform_values do |mappings|
      instructions =
        mappings.flat_map do |mapping|
          if mapping.catch_all?
            mapping.destination_addresses
          else
            mapping.destination_addresses.flat_map { |addr| "#{mapping.inbound_local}:#{addr}" }
          end
        end

      instructions.compact.sort.uniq
    end
  end

  def forwardemail_txt_records_plaintext
    forwardemail_instructions.transform_values do |instructions|
      instructions
        .each_with_object([]) do |instruction, acc|
          if acc.empty?
            acc << instruction
          else
            last_record = acc.last
            # We want to stay under 256 characters for the TXT record, and encryption seems to about double the size
            if last_record.length + instruction.length + "forward-email=".length < 100
              acc[-1] = "#{last_record},#{instruction}"
            else
              acc << instruction
            end
          end
        end
        .map { |record| "forward-email=#{record}" }
    end
  end

  def encrypt_forwardemail_txt_record(record)
    Net::HTTP.start("api.forwardemail.net", 443, use_ssl: true) do |http|
      request = Net::HTTP::Post.new("/v1/encrypt")
      request.set_form_data(input: record)
      response = http.request(request)
      return nil unless response.is_a?(Net::HTTPSuccess)

      response.body
    end
  end

  def forwardemail_txt_records_encrypted
    forwardemail_txt_records_plaintext.transform_values do |records|
      records.map { |record| encrypt_forwardemail_txt_record(record) }
    end
  end
end
