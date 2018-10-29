class Types::CmsVariable < Types::BaseObject
  field :id, Int, null: false
  field :key, String, null: false
  field :value_json, String, null: false, camelize: false

  def value_json
    object.value.to_json
  end
end
