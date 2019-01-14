class Types::PermissionType < Types::BaseObject
  field :id, Int, null: false
  field :model, Types::PermissionedModelType, null: false
  field :staff_position, Types::StaffPositionType, null: false, camelize: false
  field :permission, String, null: false

  association_loaders :staff_position
end
