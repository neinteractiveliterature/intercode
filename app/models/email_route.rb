class EmailRoute < ApplicationRecord
  def self.parse_address(raw_address)
    return nil if raw_address.blank?

    address = if raw_address.is_a?(Mail::Address)
      raw_address
    else
      begin
        Mail::Address.new(raw_address)
      rescue
        # unparseable address
        return nil
      end
    end

    return nil unless address.local # 'undisclosed-recipients:;' as an address produces this
    return nil unless address.domain # 'Ouyang' as an address produces this

    address
  end

  def self.normalize_address(raw_address)
    address = parse_address(raw_address)
    return nil unless address

    # remove +whatever and all dots
    local_normalized = address.local.gsub(/\+.*/, '').delete('.')
    "#{local_normalized}@#{address.domain}".downcase
  end

  def receiver_address=(address)
    self[:receiver_address] = EmailRoute.normalize_address(address)
  end
end
