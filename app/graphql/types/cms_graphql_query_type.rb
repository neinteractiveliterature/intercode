# frozen_string_literal: true
class Types::CmsGraphqlQueryType < Types::BaseObject
  field :admin_notes, String, null: true do
    authorize_action :update
  end
  field :current_ability_can_delete, Boolean, null: false
  field :current_ability_can_update, Boolean, null: false
  field :id, ID, null: false
  field :identifier, String, null: false
  field :query, String, null: false

  def current_ability_can_update
    dataloader.with(Sources::ModelPermission, CmsGraphqlQuery).load([pundit_user, :update, object.id])
  end

  def current_ability_can_delete
    dataloader.with(Sources::ModelPermission, CmsGraphqlQuery).load([pundit_user, :destroy, object.id])
  end
end
