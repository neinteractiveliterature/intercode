class Types::FormItemInputType < Types::BaseInputObject
  argument :identifier, String, required: false
  argument :item_type, String, required: false, camelize: false
  argument :admin_description, String, required: false, camelize: false
  argument :public_description, String, required: false, camelize: false
  argument :default_value, Types::JSON, required: false, camelize: false
  argument :properties, Types::JSON, required: false
end
