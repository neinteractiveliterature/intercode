class Types::PermissionType < Types::BaseObject
  field :id, Int, null: false
  field :model, Types::PermissionedModelType, null: false
  field :role, Types::PermissionedRoleType, null: false
  field :permission, String, null: false
end
