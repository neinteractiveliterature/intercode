# frozen_string_literal: true
class Types::LiquidAssign < Types::BaseObject
  field :name, String, null: false
  field :drop_class_name, String, null: false, camelize: false
  field :cms_variable_value_json, String, null: true, camelize: false
end
