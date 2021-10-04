# frozen_string_literal: true
class Types::CmsGraphqlQueryType < Types::BaseObject
  field :id,
        Int,
        deprecation_reason:
          'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
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
