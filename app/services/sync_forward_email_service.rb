class SyncForwardEmailService < CivilService::Service
  attr_reader :mappings_by_domain

  def initialize(mappings_by_domain:)
    @mappings_by_domain = mappings_by_domain
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
