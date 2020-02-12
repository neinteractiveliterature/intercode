class Types::CmsPartialType < Types::BaseObject
  field :id, Integer, null: false
  field :name, String, null: true
  field :content, String, null: true
  field :admin_notes, String, null: true do
    authorize_action :update
  end
  field :current_ability_can_update, Boolean, null: false
  field :current_ability_can_delete, Boolean, null: false

  def current_ability_can_update
    ModelPermissionLoader.for(CmsPartial, [:parent]).load([pundit_user, :update, object.id])
  end

  def current_ability_can_delete
    ModelPermissionLoader.for(CmsPartial, [:parent]).load([pundit_user, :destroy, object.id])
  end
end
