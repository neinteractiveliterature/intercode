class EmailRoute < ApplicationRecord
  def self.normalize_address(raw_address)
    return nil if raw_address.blank?

    address = if raw_address.is_a?(Mail::Address)
      raw_address
    else
      Mail::Address.new(raw_address)
    end

    # remove +whatever and all dots
    local_normalized = address.local.gsub(/\+.*/, '').gsub(/\./, '')
    "#{local_normalized}@#{address.domain}".downcase
  end

  def receiver_address=(address)
    self[:receiver_address] = EmailRoute.normalize_address(address)
  end
end
