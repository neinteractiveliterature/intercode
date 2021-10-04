# frozen_string_literal: true
class Types::CmsContentGroupType < Types::BaseObject
  field :id,
        Int,
        deprecation_reason:
          'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :name, String, null: false
  field :contents, [Types::CmsContentType], null: false
  field :permissions, [Types::PermissionType], null: false
  field :current_ability_can_update, Boolean, null: false
  field :current_ability_can_delete, Boolean, null: false

  def current_ability_can_update
    ModelPermissionLoader.for(CmsContentGroup).load([pundit_user, :update, object.id])
  end

  def current_ability_can_delete
    ModelPermissionLoader.for(CmsContentGroup).load([pundit_user, :destroy, object.id])
  end

  def contents
    object.cms_content_group_associations.includes(:content).map(&:content)
  end
end
