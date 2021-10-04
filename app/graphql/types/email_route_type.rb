# frozen_string_literal: true
class Types::EmailRouteType < Types::BaseObject
  field :id,
        Int,
        deprecation_reason:
          'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :receiver_address, String, null: false
  field :forward_addresses, [String], null: true
end
