# frozen_string_literal: true
class Types::CmsPartialType < Types::BaseObject
  field :admin_notes, String, null: true do
    authorize_action :update
  end
  field :content, String, null: true
  field :current_ability_can_delete, Boolean, null: false
  field :current_ability_can_update, Boolean, null: false
  field :id, ID, null: false
  field :name, String, null: true

  def current_ability_can_update
    dataloader.with(Sources::ModelPermission, CmsPartial, [:parent]).load([pundit_user, :update, object.id])
  end

  def current_ability_can_delete
    dataloader.with(Sources::ModelPermission, CmsPartial, [:parent]).load([pundit_user, :destroy, object.id])
  end
end
