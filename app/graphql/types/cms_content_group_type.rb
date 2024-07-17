# frozen_string_literal: true
class Types::CmsContentGroupType < Types::BaseObject
  field :contents, [Types::CmsContentType], null: false
  field :current_ability_can_delete, Boolean, null: false
  field :current_ability_can_update, Boolean, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :permissions, [Types::PermissionType], null: false

  def current_ability_can_update
    dataloader.with(Sources::ModelPermission, CmsContentGroup).load([pundit_user, :update, object.id])
  end

  def current_ability_can_delete
    dataloader.with(Sources::ModelPermission, CmsContentGroup).load([pundit_user, :destroy, object.id])
  end

  def contents
    object.cms_content_group_associations.includes(:content).filter_map(&:content)
  end
end
