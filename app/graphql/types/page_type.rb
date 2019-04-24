class Types::PageType < Types::BaseObject
  field :id, Integer, null: false
  field :name, String, null: true
  field :slug, String, null: true
  field :content, String, null: true
  field :content_html, String, null: false
  field :admin_notes, String, null: true do
    guard ->(graphql_object, _args, ctx) do
      ctx[:current_ability].can?(:update, graphql_object.object)
    end
  end
  field :skip_clickwrap_agreement, Boolean, null: true
  field :cms_layout, Types::CmsLayoutType, null: true
  field :current_ability_can_update, Boolean, null: false
  field :current_ability_can_delete, Boolean, null: false

  def content_html
    CmsPageContentLoader.for(cms_rendering_context).load(object)
  end

  def current_ability_can_update
    ModelPermissionLoader.for(Page).load([current_ability, :update, object.id])
  end

  def current_ability_can_delete
    ModelPermissionLoader.for(Page).load([current_ability, :destroy, object.id])
  end
end
