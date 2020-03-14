class Types::EmailRouteType < Types::BaseObject
  field :id, Int, null: false
  field :receiver_address, String, null: false
  field :forward_addresses, [String], null: true
end
