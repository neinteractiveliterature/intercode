class Types::PermissionInputType < Types::BaseInputObject
  argument :model_type, String, required: true, camelize: false
  argument :model_id, Int, required: true, camelize: false
  argument :permission, String, required: true
end
