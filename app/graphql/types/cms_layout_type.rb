# frozen_string_literal: true
class Types::CmsLayoutType < Types::BaseObject
  field :admin_notes, String, null: true do
    authorize_action :update
  end
  field :content, String, null: true
  field :content_html, String, null: true do
    argument :path, String, required: false
  end
  field :content_html_with_placeholders, String, null: true do
    argument :path, String, required: false
  end
  field :current_ability_can_delete, Boolean, null: false
  field :current_ability_can_update, Boolean, null: false
  field :id, ID, null: false
  field :name, String, null: true
  field :navbar_classes, String, null: true

  def current_ability_can_update
    dataloader.with(Sources::ModelPermission, CmsLayout, [:parent]).load([pundit_user, :update, object.id])
  end

  def current_ability_can_delete
    dataloader.with(Sources::ModelPermission, CmsLayout, [:parent]).load([pundit_user, :destroy, object.id])
  end

  def content_html(path: nil)
    rendering_context = cms_rendering_context_for_path(path)
    rendering_context.render_layout_content(object, rendering_context.liquid_assigns_for_single_page_app(object))
  end

  def content_html_with_placeholders(path: nil)
    rendering_context = cms_rendering_context_for_path(path)
    rendering_context.render_layout_content(object, rendering_context.liquid_assigns_for_placeholder_template)
  end

  private

  def cms_rendering_context_for_path(path)
    @cms_rendering_context_by_path ||= {}
    @cms_rendering_context_by_path[path] ||= cms_rendering_context_for_cms_parent(object.parent, path:)
  end
end
