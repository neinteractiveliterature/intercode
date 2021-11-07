# frozen_string_literal: true
class Types::CmsContentGroupType < Types::BaseObject
  field :transitional_id,
        ID,
        deprecation_reason:
          "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
        null: false,
        method: :id,
        camelize: true
  field :id, ID, null: false
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
