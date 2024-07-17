# frozen_string_literal: true
class Types::PermissionType < Types::BaseObject
  field :id, ID, null: false
  field :model, Types::PermissionedModelType, null: false
  field :permission, String, null: false
  field :role, Types::PermissionedRoleType, null: false
end
