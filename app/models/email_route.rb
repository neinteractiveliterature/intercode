class EmailRoute < ApplicationRecord
  def self.normalize_address(raw_address)
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

    # remove +whatever and all dots
    local_normalized = address.local.gsub(/\+.*/, '').delete('.')
    "#{local_normalized}@#{address.domain}".downcase
  end

  def receiver_address=(address)
    self[:receiver_address] = EmailRoute.normalize_address(address)
  end
end
