# frozen_string_literal: true
class Types::EmailRouteFiltersInputType < Types::BaseInputObject
  argument :forward_addresses, String, required: false, camelize: false
  argument :receiver_address, String, required: false, camelize: false
end
