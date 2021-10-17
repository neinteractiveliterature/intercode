# frozen_string_literal: true
class Types::PageType < Types::BaseObject
  field :id,
        Integer,
        deprecation_reason:
          "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :name, String, null: true
  field :slug, String, null: true
  field :content, String, null: true
  field :content_html, String, null: false
  field :admin_notes, String, null: true do
    authorize_action :update
  end
  field :skip_clickwrap_agreement, Boolean, null: true
  field :cms_layout, Types::CmsLayoutType, null: true
  field :current_ability_can_update, Boolean, null: false
  field :current_ability_can_delete, Boolean, null: false
  field :hidden_from_search, Boolean, null: false
  field :referenced_partials, [Types::CmsPartialType], null: false, method: :referenced_partials_recursive

  def content_html
    CmsPageContentLoader.for(cms_rendering_context_for_cms_parent(object.parent)).load(object)
  end

  def current_ability_can_update
    ModelPermissionLoader.for(Page, [:parent]).load([pundit_user, :update, object.id])
  end

  def current_ability_can_delete
    ModelPermissionLoader.for(Page, [:parent]).load([pundit_user, :destroy, object.id])
  end
end
