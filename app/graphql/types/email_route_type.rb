# frozen_string_literal: true
class Types::EmailRouteType < Types::BaseObject
  field :transitional_id,
        ID,
        deprecation_reason:
          "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
        null: false,
        method: :id,
        camelize: true
  field :id, ID, null: false
  field :receiver_address, String, null: false
  field :forward_addresses, [String], null: true
end
