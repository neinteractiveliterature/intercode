class Types::CmsContentGroupType < Types::BaseObject
  field :id, Int, null: false
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
