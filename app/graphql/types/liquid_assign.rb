class Types::LiquidAssign < Types::BaseObject
  field :name, String, null: false
  field :drop_class_name, String, null: false, camelize: false
end
