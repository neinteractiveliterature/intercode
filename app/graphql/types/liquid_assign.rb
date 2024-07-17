# frozen_string_literal: true
class Types::LiquidAssign < Types::BaseObject
  field :cms_variable_value_json, String, null: true, camelize: false
  field :drop_class_name, String, null: false, camelize: false
  field :name, String, null: false
end
