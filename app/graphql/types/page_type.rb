class Types::PageType < Types::BaseObject
  field :id, Integer, null: false
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

  def content_html
    CmsPageContentLoader.for(cms_rendering_context).load(object)
  end

  def current_ability_can_update
    ModelPermissionLoader.for(Page, [:parent]).load([pundit_user, :update, object.id])
  end

  def current_ability_can_delete
    ModelPermissionLoader.for(Page, [:parent]).load([pundit_user, :destroy, object.id])
  end
end
