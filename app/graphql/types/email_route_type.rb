# frozen_string_literal: true
class Types::EmailRouteType < Types::BaseObject
  field :forward_addresses, [String], null: true
  field :id, ID, null: false
  field :receiver_address, String, null: false
end
