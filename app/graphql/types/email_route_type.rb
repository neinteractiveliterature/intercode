# frozen_string_literal: true
class Types::EmailRouteType < Types::BaseObject
  field :id, ID, null: false
  field :receiver_address, String, null: false
  field :forward_addresses, [String], null: true
end
