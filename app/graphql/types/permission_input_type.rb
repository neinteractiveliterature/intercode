class Types::PermissionInputType < Types::BaseInputObject
  argument :model_type, String, required: false, camelize: false
  argument :model_id, Int, required: false, camelize: false
  argument :permission, String, required: true
end
