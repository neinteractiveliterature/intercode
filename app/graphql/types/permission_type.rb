# frozen_string_literal: true
class Types::PermissionType < Types::BaseObject
  field :id,
        Int,
        deprecation_reason:
          'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :model, Types::PermissionedModelType, null: false
  field :role, Types::PermissionedRoleType, null: false
  field :permission, String, null: false
end
