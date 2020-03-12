class EmailRoute < ApplicationRecord
  def self.normalize_address(address)
    return nil if address.nil?
    address = Mail::Address.new(address) unless address.is_a?(Mail::Address)

    # remove +whatever and all dots
    local_normalized = address.local.gsub(/\+.*/, '').gsub(/\./, '')
    "#{local_normalized}@#{address.domain}".downcase
  end

  def receiver_address=(address)
    self[:receiver_address] = EmailRoute.normalize_address(address)
  end

  def forward_addresses=(addresses)
    self[:forward_addresses] = addresses.map do |address|
      EmailRoute.normalize_address(address)
    end
  end
end
