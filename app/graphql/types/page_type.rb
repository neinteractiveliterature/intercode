# frozen_string_literal: true
class Types::PageType < Types::BaseObject
  field :admin_notes, String, null: true do
    authorize_action :update
  end
  field :cms_layout, Types::CmsLayoutType, null: true
  field :content, String, null: true
  field :content_html, String, null: false
  field :current_ability_can_delete, Boolean, null: false
  field :current_ability_can_update, Boolean, null: false
  field :hidden_from_search, Boolean, null: false
  field :id, ID, null: false
  field :name, String, null: true
  field :referenced_partials, [Types::CmsPartialType], null: false, method: :referenced_partials_recursive
  field :skip_clickwrap_agreement, Boolean, null: true
  field :slug, String, null: true

  def content_html
    dataloader.with(Sources::CmsPageContent, cms_rendering_context_for_cms_parent(object.parent)).load(object)
  end

  def current_ability_can_update
    dataloader.with(Sources::ModelPermission, Page, [:parent]).load([pundit_user, :update, object.id])
  end

  def current_ability_can_delete
    dataloader.with(Sources::ModelPermission, Page, [:parent]).load([pundit_user, :destroy, object.id])
  end
end
