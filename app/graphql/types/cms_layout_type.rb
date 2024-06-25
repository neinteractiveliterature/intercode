# frozen_string_literal: true
class Types::CmsLayoutType < Types::BaseObject
  field :id, ID, null: false
  field :name, String, null: true
  field :content, String, null: true
  field :content_html, String, null: true do
    argument :path, String, required: false
  end
  field :content_html_with_placeholders, String, null: true do
    argument :path, String, required: false
  end
  field :app_root_content, String, null: false do
    argument :path, String, required: true
  end
  field :navbar_classes, String, null: true
  field :admin_notes, String, null: true do
    authorize_action :update
  end
  field :current_ability_can_update, Boolean, null: false
  field :current_ability_can_delete, Boolean, null: false

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

  def app_root_content(path:)
    rendering_context = cms_rendering_context_for_path(path)
    page = context[:controller].current_cms_page(context[:controller].request.path)
    event = context[:controller].event_for_path(context[:controller].request.path)
    page_title = page&.name

    rendering_context.render_app_root_content(
      object,
      {
        "content_for_head" =>
          context[:controller].render_to_string(partial: "layouts/head", assigns: { page:, event:, page_title: }),
        "event" => event,
        "page" => page,
        "browser_warning" => context[:controller].browser_warning
      }
    )
  end

  private

  def cms_rendering_context_for_path(path)
    @cms_rendering_context_by_path ||= {}
    @cms_rendering_context_by_path[path] ||= cms_rendering_context_for_cms_parent(object.parent, path: path)
  end
end
