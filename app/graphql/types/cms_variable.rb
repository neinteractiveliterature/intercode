class Types::CmsVariable < Types::BaseObject
  field :id, Int, null: false
  field :key, String, null: false
  field :value_json, String, null: false, camelize: false
  field :current_ability_can_update, Boolean, null: false
  field :current_ability_can_delete, Boolean, null: false

  def current_ability_can_update
    ModelPermissionLoader.for(::CmsVariable).load([pundit_user, :update, object.id])
  end

  def current_ability_can_delete
    ModelPermissionLoader.for(::CmsVariable).load([pundit_user, :destroy, object.id])
  end

  def value_json
    object.value.to_json
  end
end
