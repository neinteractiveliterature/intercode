# frozen_string_literal: true
class Types::FormItemInputType < Types::BaseInputObject
  argument :admin_description, String, required: false, camelize: false
  argument :default_value, Types::JSON, required: false, camelize: false
  argument :expose_in, [Types::FormItemExposeInType], required: false, camelize: false
  argument :identifier, String, required: false
  argument :item_type, String, required: false, camelize: false
  argument :properties, Types::JSON, required: false
  argument :public_description, String, required: false, camelize: false
  argument :visibility, Types::FormItemRoleType, required: false
  argument :writeability, Types::FormItemRoleType, required: false
end
