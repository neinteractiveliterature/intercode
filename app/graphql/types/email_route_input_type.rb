class Types::EmailRouteInputType < Types::BaseInputObject
  argument :receiver_address, String, required: false, camelize: false
  argument :forward_addresses, [String], required: false, camelize: false
end
