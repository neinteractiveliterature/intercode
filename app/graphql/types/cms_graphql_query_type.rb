class Types::CmsGraphqlQueryType < Types::BaseObject
  field :id, Int, null: false
  field :identifier, String, null: false
  field :query, String, null: false
  field :admin_notes, String, null: true do
    authorize_action :update
  end
  field :current_ability_can_update, Boolean, null: false
  field :current_ability_can_delete, Boolean, null: false

  def current_ability_can_update
    ModelPermissionLoader.for(CmsGraphqlQuery).load([pundit_user, :update, object.id])
  end

  def current_ability_can_delete
    ModelPermissionLoader.for(CmsGraphqlQuery).load([pundit_user, :destroy, object.id])
  end
end
