class Types::CmsVariableInput < Types::BaseInputObject
  argument :key, String, required: true
  argument :value_json, String, required: true, camelize: false
end
