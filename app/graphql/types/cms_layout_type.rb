class Types::CmsLayoutType < Types::BaseObject
  field :id, Integer, null: false
  field :name, String, null: true
  field :content, String, null: true
  field :content_html, String, null: true do
    argument :path, String, required: false
  end
  field :navbar_classes, String, null: true
  field :admin_notes, String, null: true do
    authorize_action :update
  end
  field :current_ability_can_update, Boolean, null: false
  field :current_ability_can_delete, Boolean, null: false

  def current_ability_can_update
    ModelPermissionLoader.for(CmsLayout, [:parent]).load([pundit_user, :update, object.id])
  end

  def current_ability_can_delete
    ModelPermissionLoader.for(CmsLayout, [:parent]).load([pundit_user, :destroy, object.id])
  end

  def content_html(path: nil)
    rendering_context = cms_rendering_context(path: path)
    rendering_context.render_layout_content(
      object,
      rendering_context.liquid_assigns_for_single_page_app(object)
    )
  end
end
