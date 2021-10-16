# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: email_routes
#
#  id                :bigint           not null, primary key
#  forward_addresses :text             not null, is an Array
#  receiver_address  :text             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_email_routes_on_receiver_address  (receiver_address) UNIQUE
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
class EmailRoute < ApplicationRecord
  def self.parse_address(raw_address)
    return nil if raw_address.blank?

    address =
      if raw_address.is_a?(Mail::Address)
        raw_address
      else
        begin
          Mail::Address.new(raw_address)
        rescue StandardError
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
